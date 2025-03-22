import hre from 'hardhat';
import {
  AggyCore__factory,
  AggyTaskFactory__factory,
  AggyToken__factory,
  IAggyTask,
  AggyTask__factory,
  AggyCore,
  AggyToken,
  AggyTaskFactory,
  AggyTask,
} from '../typechain-types';
import { Signer } from 'ethers';

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

async function runTaskLifecycle(
  taskInput: IAggyTask.TaskStruct,
  actionLabel: string,
  aggyCore: AggyCore,
  aggyTaskFactory: AggyTaskFactory,
  aggyToken: AggyToken,
  signer: Signer,
  finalAction: (task: AggyTask, taskId: string) => Promise<void>,
) {
  console.log(`\n\n=== ${actionLabel} path lifecycle check ===`);

  console.log(`Task tuple: ${taskToTuple(taskInput)}`);

  await aggyCore.createTask(taskInput);
  console.log('Task created');

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const taskAddress = await aggyTaskFactory.getTaskAddressById(taskInput.id);
  console.log(`Task address: ${taskAddress}`);

  const taskIdShort = taskInput.id.split('-')[0];

  await hre.mbDeployer.link(signer, 'AggyTask', taskAddress, {
    addressLabel: 'aggy_task_' + taskIdShort,
    contractVersion: '1.2',
    contractLabel: 'aggy_task',
  });

  console.log('Getting some tokens in order to stake to the task');
  await aggyCore.transferTokens(signer, taskInput.stakeAmount);

  console.log('Approving tokens to the task');
  await aggyToken.approve(taskAddress, taskInput.stakeAmount);

  const task = AggyTask__factory.connect(taskAddress, signer);

  console.log('Starting to work on the task');
  await task.claimTask();

  await finalAction(task, taskInput.id);
}

async function main() {
  const signers = await hre.ethers.getSigners();
  const signer = signers[0];

  await hre.mbDeployer.setup();

  const adminAccounts = [
    '0x0A2374C6659bd9dC9a2ECB13cb83C847dc4547D9', // D
    '0xf991A961d45667F78A49D3D802fd0EDF65118924', // J
  ];
  const adminRole = '0x0000000000000000000000000000000000000000000000000000000000000000';

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

  const aggyCore = AggyCore__factory.connect(aggyCoreAddress, signer);

  // add admin role for all admin accounts
  for (const adminAccount of adminAccounts) {
    await aggyCore.grantRole(adminRole, adminAccount);
    await aggyTaskFactory.grantRole(adminRole, adminAccount);
  }

  console.log('Aggy setup complete');

  // Basic check -------------------------------------------------------------

  const prompt = await aggyCore.getPrompt();
  console.log(`Prompt readback: ${prompt}\n`);

  // Setup and run task lifecycle checks --------------------------------------

  const longDeadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 1 week from now
  const pastDeadline = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 7; // 1 week ago

  const taskSuccess: IAggyTask.TaskStruct = {
    name: 'Raise capital',
    id: '3f8c2c74-2a0f-4f1c-bbe7-118fdacfa4a6',
    status: 0,
    contractor: signer,
    details: 'Reach out to 10 VCs and offer to sell them 100,000 tokens in exchange for 1% of the tokens.',
    rewardAmount: 100,
    stakeAmount: 100,
    deadline: longDeadline,
  };

  const taskFail: IAggyTask.TaskStruct = {
    name: 'Build a research center',
    id: 'a7b8f342-4e99-4c29-b8e0-1a2a8b799f0c',
    status: 0,
    contractor: signer,
    details: 'Interview potential construction firms.',
    rewardAmount: 300,
    stakeAmount: 400,
    deadline: pastDeadline,
  };
  const taskCancel: IAggyTask.TaskStruct = {
    name: 'Rally supporters',
    id: '1c3d5ea1-9f6b-4a61-a4c2-bf2d67864e75',
    status: 0,
    contractor: signer,
    details: 'Start a social media account and post once a week.',
    rewardAmount: 50,
    stakeAmount: 600,
    deadline: longDeadline,
  };

  await runTaskLifecycle(taskSuccess, 'Happy', aggyCore, aggyTaskFactory, aggyToken, signer, async (task, taskId) => {
    console.log('Complete work on the task');
    await task.completeTask();

    console.log('Confirm the task');
    await aggyCore.confirmTask(taskId);
  });

  await runTaskLifecycle(taskFail, 'Fail', aggyCore, aggyTaskFactory, aggyToken, signer, async (_task, taskId) => {
    console.log('Fail the task');
    await aggyCore.failTask(taskId);
  });

  await runTaskLifecycle(taskCancel, 'Cancel', aggyCore, aggyTaskFactory, aggyToken, signer, async (_task, taskId) => {
    console.log('Cancel the task');
    await aggyCore.cancelTask(taskId);
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
