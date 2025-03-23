// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "./interfaces/IAggyToken.sol";
import "./interfaces/IAggyTask.sol";
import "./interfaces/OptimisticOracleExtended.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AggyTask {
    address public aggyCore;
    IAggyToken public aggyToken;

    IAggyTask.Task public task;

    // UMA parameters
    OptimisticOracleExtended public oracle;
    bytes32 public assertionId;
    bytes32 public umaIdentifier = bytes32("ASSERT_TRUTH"); // applicable to UMA v3
    uint64 public umaLiveness = 30; // in seconds
    bytes32 public constant umaDomainId = 0x0;

    modifier onlyAggy() {
        require(msg.sender == aggyCore, "AggyTaskFactory: must be Aggy");
        _;
    }

    constructor(
        address _aggyCore,
        address _aggyToken,
        address _requester,
        address _oracle,
        IAggyTask.TaskData memory _taskData
    ) {
        aggyCore = _aggyCore;
        aggyToken = IAggyToken(_aggyToken);

        task.data = _taskData;
        task.state.requester = _requester;
        task.state.created = uint64(block.timestamp);
        task.state.updated = uint64(block.timestamp);

        oracle = OptimisticOracleExtended(_oracle);

        emit IAggyTask.TaskCreated(address(this), task);
    }

    /// @notice Update the UMA oracle address
    /// @param _oracle The oracle address
    function setUmaOracle(address _oracle) external onlyAggy {
        oracle = OptimisticOracleExtended(_oracle);
    }

    /// @notice Update the UMA liveness
    /// @param _liveness The liveness
    function setUmaLiveness(uint64 _liveness) external onlyAggy {
        umaLiveness = _liveness;
    }

    /// @notice Get the task's token balance
    function tokenBalance() external view returns (uint256) {
        return aggyToken.balanceOf(address(this));
    }

    /// @notice Get the task's data
    /// @return The task's data
    function getTask() external view returns (IAggyTask.Task memory) {
        return task;
    }

    /// @notice Claim the task to start work on it
    /// @param _contractor The contractor's address
    function claimTask(address _contractor) external onlyAggy {
        require(
            task.state.status == IAggyTask.TaskStatus.Created,
            "AggyTask: task must be Created"
        );

        task.state.status = IAggyTask.TaskStatus.InProgress;
        task.state.contractor = _contractor;
        task.state.started = uint64(block.timestamp);
        task.state.updated = uint64(block.timestamp);

        emit IAggyTask.TaskClaimed(address(this), task);
    }

    /// @notice Complete the task and put it into a review state
    /// @param _contractor The contractor's address
    function completeTask(address _contractor) external onlyAggy {
        require(
            task.state.status == IAggyTask.TaskStatus.InProgress,
            "AggyTask: task must be InProgress"
        );
        require(
            _contractor == task.state.contractor,
            "AggyTask: must be contractor"
        );

        task.state.status = IAggyTask.TaskStatus.UnderReview;
        task.state.submitted = uint64(block.timestamp);
        task.state.updated = uint64(block.timestamp);

        // request resolution from the UMA optimistic oracle
        // only if oracle set
        if (address(oracle) != address(0)) {
            // construct the claim
            string memory claim = string(
                abi.encodePacked(
                    "The task '",
                    task.data.name,
                    "' with ID '",
                    task.data.id,
                    "' was completed successfully."
                )
            );

            // we can only use the default currency, it appears
            address defaultCurrency = oracle.defaultCurrency();

            // get the minimum bond required
            uint256 minBond = oracle.getMinimumBond(address(aggyToken));

            // if the minimum bond >0, attempt to transfer from the contractor to this
            // contract and then approve the oracle to transfer the bond
            if (minBond > 0) {
                require(
                    aggyToken.transferFrom(_contractor, address(this), minBond),
                    "AggyTask: failed to transfer bond"
                );

                aggyToken.approve(address(oracle), minBond);
            }

            // assert to UMA optimistic oracle
            assertionId = oracle.assertTruth(
                bytes(claim),
                address(this), // asserter
                address(this), // callback
                address(0), // no escalation manager
                umaLiveness,
                IERC20(defaultCurrency),
                minBond,
                umaIdentifier,
                umaDomainId
            );

            emit IAggyTask.TaskAssertionMade(assertionId, address(this));
        }

        emit IAggyTask.TaskCompleted(address(this), task);
    }

    /// @notice Confirm the task and transfer the reward amount to the contractor
    function confirmTask() external onlyAggy {
        require(
            task.state.status == IAggyTask.TaskStatus.UnderReview,
            "AggyTask: task must be UnderReview"
        );

        task.state.status = IAggyTask.TaskStatus.Confirmed;
        task.state.finished = uint64(block.timestamp);
        task.state.updated = uint64(block.timestamp);

        // transfer reward + stake amount from this contract to contractor
        require(
            aggyToken.transfer(
                task.state.contractor,
                task.data.stakeAmount + task.data.rewardAmount // could also do AggyToken.balanceOf(address(this))
            ),
            "AggyTask: failed to transfer reward amount"
        );

        emit IAggyTask.TaskConfirmed(address(this), task);
    }

    /// @notice Fail the task and transfer the stake and reward amounts back to Aggy Core
    function failTask() external onlyAggy {
        require(
            task.state.status == IAggyTask.TaskStatus.UnderReview ||
                block.timestamp > task.data.deadline,
            "AggyTask: task must be UnderReview or past the deadline"
        );

        task.state.status = IAggyTask.TaskStatus.Failed;
        task.state.finished = uint64(block.timestamp);
        task.state.updated = uint64(block.timestamp);

        // transfer stake and reward amounts from this contract to the requester
        require(
            aggyToken.transfer(
                task.state.requester,
                task.data.stakeAmount + task.data.rewardAmount // could also do AggyToken.balanceOf(address(this))
            ),
            "AggyTask: failed to transfer stake and reward amounts"
        );

        emit IAggyTask.TaskFailed(address(this), task);
    }

    /// @notice Cancel the task and transfer the stake and reward amounts back to contractor and Aggy Core
    /// @param _requester The requester's address
    function cancelTask(address _requester) external onlyAggy {
        require(
            task.state.status == IAggyTask.TaskStatus.Created ||
                task.state.status == IAggyTask.TaskStatus.InProgress,
            "AggyTask: task must be Created or InProgress"
        );
        require(
            _requester == task.state.requester,
            "AggyTask: must be requester"
        );

        task.state.status = IAggyTask.TaskStatus.Cancelled;
        task.state.finished = uint64(block.timestamp);
        task.state.updated = uint64(block.timestamp);

        // split the difference - transfer stake amount back to contractor and reward amount back to the requester
        require(
            aggyToken.transfer(task.state.contractor, task.data.stakeAmount),
            "AggyTask: failed to transfer stake amount"
        );
        require(
            aggyToken.transfer(task.state.requester, task.data.rewardAmount),
            "AggyTask: failed to transfer reward amount"
        );

        emit IAggyTask.TaskCancelled(address(this), task);
    }

    // UMA callbacks

    /// @notice Callback from the UMA optimistic oracle when an assertion is resolved
    /// @param _assertionId The assertion ID
    /// @param _assertedTruth The asserted truth
    function assertionResolvedCallback(
        bytes32 _assertionId,
        bool _assertedTruth
    ) external {
        require(
            msg.sender == address(oracle),
            "AggyTask: invalid oracle caller"
        );
        require(_assertionId == assertionId, "AggyTask: unknown assertion");

        task.state.finished = uint64(block.timestamp);
        task.state.updated = uint64(block.timestamp);

        if (_assertedTruth) {
            task.state.status = IAggyTask.TaskStatus.Confirmed;

            require(
                aggyToken.transfer(
                    task.state.contractor,
                    task.data.stakeAmount + task.data.rewardAmount
                ),
                "AggyTask: failed to transfer reward"
            );

            emit IAggyTask.TaskConfirmed(address(this), task);
        } else {
            task.state.status = IAggyTask.TaskStatus.Failed;

            require(
                aggyToken.transfer(
                    task.state.requester,
                    task.data.stakeAmount + task.data.rewardAmount
                ),
                "AggyTask: failed to return funds"
            );

            emit IAggyTask.TaskFailed(address(this), task);
        }
    }

    /// @notice Callback from the UMA optimistic oracle when an assertion is disputed
    /// @param _assertionId The assertion ID
    function assertionDisputedCallback(bytes32 _assertionId) external {
        require(
            msg.sender == address(oracle),
            "AggyTask: invalid oracle caller"
        );
        require(_assertionId == assertionId, "AggyTask: unknown assertion");

        emit IAggyTask.TaskDisputed(address(this), _assertionId);
    }
}
