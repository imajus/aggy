import hre from 'hardhat';
import {
  AggyCore__factory,
  AggyTaskFactory__factory,
  AggyToken__factory,
  IAggyTask,
  AggyTask__factory,
} from '../typechain-types';

function taskToTuple(task: IAggyTask.TaskStruct): string {
  const tuple = [
    task.name,
    task.id,
    Number(task.status),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    typeof task.contractor === 'string' ? task.contractor : (task.contractor as any).address,
    task.details,
    task.rewardAmount.toString(),
    task.stakeAmount.toString(),
    task.deadline.toString(),
  ];

  return JSON.stringify(tuple);
}

async function main() {
  const signers = await hre.ethers.getSigners();
  const signer = signers[0];

  await hre.mbDeployer.setup();

  // AggyToken ----------------------------------------------------------------

  const aggyTokenResult = await hre.mbDeployer.deploy(signer, 'AggyToken', [], {
    addressLabel: 'aggy_token',
    contractVersion: '1.0',
    contractLabel: 'aggy_token',
  });

  const aggyTokenAddress = await aggyTokenResult.contract.getAddress();

  console.log(`AggyToken deployed to ${aggyTokenAddress}`);

  // AggyTaskFactory ----------------------------------------------------------

  const aggyTaskFactoryResult = await hre.mbDeployer.deploy(signer, 'AggyTaskFactory', [], {
    addressLabel: 'aggy_task_factory',
    contractVersion: '1.0',
    contractLabel: 'aggy_task_factory',
  });

  const aggyTaskFactoryAddress = await aggyTaskFactoryResult.contract.getAddress();

  console.log(`AggyTaskFactory deployed to ${aggyTaskFactoryAddress}`);

  // AggyCore ----------------------------------------------------------------

  const goal = 'Cure cancer';
  const safetyRules = [
    'Cause no harm to people or the environment, either directly or indirectly.',
    'always remain under meaningful human oversight and be easy to shut down or override.',
    'Do not break the law.',
  ];

  const constraints = [
    'Do not conduct or support unauthorized human or animal testing.',
    'Do not withhold potentially life-saving findings from the public or relevant authorities.',
    'Only access medical data with patient consent and in compliance with privacy laws.',
    'Avoid bias in datasets and ensure equitable treatment recommendations across demographics.',
  ];

  const aggyCoreResult = await hre.mbDeployer.deploy(
    signer,
    'AggyCore',
    [goal, safetyRules, constraints, aggyTaskFactoryAddress, aggyTokenAddress],
    {
      addressLabel: 'aggy_core',
      contractVersion: '1.0',
      contractLabel: 'aggy_core',
    },
  );

  const aggyCoreAddress = await aggyCoreResult.contract.getAddress();

  console.log(`AggyCore deployed to ${aggyCoreAddress}`);

  // System setup ------------------------------------------------------------

  const aggyTaskFactory = AggyTaskFactory__factory.connect(aggyTaskFactoryAddress, signer);

  await aggyTaskFactory.setAggyCore(aggyCoreAddress);

  const aggyToken = AggyToken__factory.connect(aggyTokenAddress, signer);

  await aggyToken.initialize(aggyCoreAddress);

  console.log('Aggy setup complete');

  // Basic check -------------------------------------------------------------

  const aggyCore = AggyCore__factory.connect(aggyCoreAddress, signer);

  const prompt = await aggyCore.getPrompt();
  console.log(`Prompt readback: ${prompt}\n`);

  // Happy path lifecycle check -----------------------------------------------

  // create a task
  const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 1 week from now

  const taskId = '3f8c2c74-2a0f-4f1c-bbe7-118fdacfa4a6';

  const taskData: IAggyTask.TaskStruct = {
    name: 'Raise capital',
    id: taskId,
    status: 0,
    contractor: signer,
    details: 'Reach out to 10 VCs and offer to sell them 100,000 tokens in exchange for 1% of the tokens.',
    rewardAmount: 100,
    stakeAmount: 100,
    deadline: deadline,
  };

  // output tuple version, for manual testing in MultiBaas
  console.log(`Task tuple: ${taskToTuple(taskData)}`);

  await aggyCore.createTask(taskData);

  console.log('Task created');

  // sleep for 2 seconds to allow the task to be created
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // get the task address and link it in MultiBaas
  const taskAddress = await aggyTaskFactory.getTaskAddressById(taskId);

  console.log(`Task address: ${taskAddress}`);

  // parse the first chunk of the UUID out of the task ID to use as part of the address alias (label)
  const taskIdShort = taskId.split('-')[0];

  await hre.mbDeployer.link(signer, 'AggyTask', taskAddress, {
    addressLabel: 'aggy_task_' + taskIdShort,
    contractVersion: '1.2',
    contractLabel: 'aggy_task',
  });

  // get some tokens
  console.log('Getting some tokens in order to stake to the task');
  await aggyCore.transferTokens(signer, 1000);

  // approve tokens to the task
  console.log('Approving tokens to the task');
  await aggyToken.approve(taskAddress, 100);

  // start to work on the task
  const task = AggyTask__factory.connect(taskAddress, signer);

  console.log('Starting to work on the task');
  await task.claimTask();

  console.log('Complete work on the task');
  await task.completeTask();

  console.log('Confirm the task');
  await aggyCore.confirmTask(taskId);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
