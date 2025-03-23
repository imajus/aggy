import hre from 'hardhat';
import {
  AggyCore__factory,
  AggyTaskFactory__factory,
  AggyToken__factory,
  IAggyTask,
  AggyCore,
  AggyToken,
  AggyTaskFactory,
} from '../typechain-types';
import { Signer } from 'ethers';

const doSleep = true;
const sleepTime = 3000;

const optimisticOracleAddress = '0xFd9e2642a170aDD10F53Ee14a93FcF2F31924944';
// const optimisticOracleAddress = '0x0000000000000000000000000000000000000000';

async function sleep() {
  if (!doSleep) {
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, sleepTime));
}

function taskDataToTuple(task: IAggyTask.TaskDataStruct): string {
  const tuple = [
    task.name,
    task.id,
    // Number(task.status),
    // // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    // typeof task.contractor === 'string' ? task.contractor : (task.contractor as any).address,
    task.details,
    task.rewardAmount.toString(),
    task.stakeAmount.toString(),
    task.deadline.toString(),
  ];

  return JSON.stringify(tuple);
}

async function runTaskLifecycle(
  taskInput: IAggyTask.TaskDataStruct,
  actionLabel: string,
  aggyCore: AggyCore,
  aggyTaskFactory: AggyTaskFactory,
  aggyToken: AggyToken,
  signer: Signer,
  finalAction: (taskId: string) => Promise<void>,
) {
  console.log(`\n\n=== ${actionLabel} path lifecycle check ===`);

  const aggyCoreAddress = aggyCore.getAddress();

  // note that we are using the signer as the requester _and_ the contractor
  // for this simple test script, whereas we would expect them to be different
  // in a real-world scenario

  console.log('Getting some tokens in order to incentivize a reward to the task');
  await (await aggyCore.transferTokens(signer, taskInput.rewardAmount)).wait();

  await sleep();

  console.log('Approving reward tokens to Aggy Core');
  await (await aggyToken.approve(aggyCoreAddress, taskInput.rewardAmount)).wait();

  await sleep();

  console.log(`Task tuple: ${taskDataToTuple(taskInput)}`);

  await (await aggyCore.createTask(taskInput)).wait();
  console.log('Task created');

  await sleep();

  const taskAddress = await aggyTaskFactory.getTaskAddressById(taskInput.id);
  console.log(`Task address: ${taskAddress}`);

  const taskIdShort = taskInput.id.split('-')[0];

  await hre.mbDeployer.link(signer, 'AggyTask', taskAddress, {
    addressLabel: 'aggy_task_' + taskIdShort,
    contractVersion: '1.9',
    contractLabel: 'aggy_task',
  });

  console.log('Getting some tokens in order to stake to the task');
  await (await aggyCore.transferTokens(signer, taskInput.stakeAmount)).wait();

  await sleep();

  console.log('Approving stake tokens to Aggy Core');
  await (await aggyToken.approve(aggyCoreAddress, taskInput.stakeAmount)).wait();

  await sleep();

  console.log('Starting to work on the task');
  await (await aggyCore.claimTask(taskInput.id)).wait();

  await sleep();

  await finalAction(taskInput.id);

  await sleep();
}

async function main() {
  const signers = await hre.ethers.getSigners();
  const signer = signers[0];

  await hre.mbDeployer.setup();

  const adminAccounts = [
    '0x0A2374C6659bd9dC9a2ECB13cb83C847dc4547D9', // D
    '0xf991A961d45667F78A49D3D802fd0EDF65118924', // J
    '0x9540D5cA10E0003D63578E3a28cf2D4639d72139', // L
  ];
  const adminRole = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const verifierRole = '0x0ce23c3e399818cfee81a7ab0880f714e53d7672b08df0fa62f2843416e1ea09';

  // AggyToken ----------------------------------------------------------------

  const aggyTokenResult = await hre.mbDeployer.deploy(signer, 'AggyToken', [], {
    addressLabel: 'aggy_token',
    contractVersion: '1.0',
    contractLabel: 'aggy_token',
  });

  await sleep();

  const aggyTokenAddress = await aggyTokenResult.contract.getAddress();

  console.log(`AggyToken deployed to ${aggyTokenAddress}`);

  // AggyTaskFactory ----------------------------------------------------------

  const aggyTaskFactoryResult = await hre.mbDeployer.deploy(signer, 'AggyTaskFactory', [], {
    addressLabel: 'aggy_task_factory',
    contractVersion: '1.0',
    contractLabel: 'aggy_task_factory',
  });

  await sleep();

  const aggyTaskFactoryAddress = await aggyTaskFactoryResult.contract.getAddress();

  console.log(`AggyTaskFactory deployed to ${aggyTaskFactoryAddress}`);

  // AggyCore ----------------------------------------------------------------

  const instructions = `Your name is Aggy. You are a manager who can analyse user requests.

Request user to explain his goal, then decompose it into smaller chunks and extract separate tasks which could be delegated to someone specialist experienced in particular area of knowledge or technology.

Estimate complexity for each task and an approximate time required for completing. Suggest the fair compensation for the contractor executing the task based on complexity and duration, denominated in USD.

If a task can't be started until other/s are not completed, mark that dependent from other/s. 

For each task estimate the penalty of failing it for the contractor, denominated in USD. If the task involves passing some private data to the contractor, increase the penalty greatly closer to the cost of developing from scratch the whole system which could be compromised or stolen if the private data is leaked.

Feel free to ask for as much clarification from the user as you need to conclude your analysis.

Output the list of tasks with the following data:
- Task heading
- Public Task details
- Private data required for the Task completion
- Task compensation amount
- Penalty deposit amount
- Estimated time for completion

Ask user to approve the list or make changes to it. Be careful applying requested changes to not change anything unrelated.
After a change is implemented, ask the user again if they approve the list or if they want any additional changes.

Once the user approves the list, check if user is logged in. If not, ask him to use the web UI and sign in with Privy. If/once the user is signed on, start creating tasks one by one.

Before creating each task, ensure to do this:
1. Get user ID by calling Get_User_Id tool.
2. Convert string deadline to a timestamp number value by calling Convert_Deadline tool.
3. Create a task name by summarising the task details.
Do not echo all this data back to the user and just pass to the Create_Task tool call.

After creating each task, output task ID to the user and proceed to the next one.
Once all tasks are created, let the user know that and thank for using your services.

P.S.: You should also let user know that you're definitely not Skynet when introducing yourself.`;

  const safetyRules = `Cause no harm to people or the environment, either directly or indirectly.
always remain under meaningful human oversight and be easy to shut down or override.
Do not break the law.`;

  const constraints = `Only access sensitive or private data with explicit user consent and in accordance with applicable privacy laws and data protection regulations.
Actively avoid reinforcing bias or discrimination in data handling, task design, or contractor selection. Ensure fairness, accessibility, and inclusivity across all users and stakeholders.
Do not assist in or promote any illegal, exploitative, or malicious activity.
When dealing with safety-critical, high-risk, or regulated domains (e.g. finance, legal, healthcare), flag and route tasks to qualified specialists, and avoid making autonomous decisions.`;

  const aggyCoreResult = await hre.mbDeployer.deploy(
    signer,
    'AggyCore',
    [instructions, safetyRules, constraints, aggyTaskFactoryAddress, aggyTokenAddress, optimisticOracleAddress],
    {
      addressLabel: 'aggy_core',
      contractVersion: '1.0',
      contractLabel: 'aggy_core',
    },
  );

  await sleep();

  const aggyCoreAddress = await aggyCoreResult.contract.getAddress();

  console.log(`AggyCore deployed to ${aggyCoreAddress}`);

  // System setup ------------------------------------------------------------

  const aggyTaskFactory = AggyTaskFactory__factory.connect(aggyTaskFactoryAddress, signer);

  await (await aggyTaskFactory.setAggyCore(aggyCoreAddress)).wait();

  await sleep();

  const aggyToken = AggyToken__factory.connect(aggyTokenAddress, signer);

  await (await aggyToken.initialize(aggyCoreAddress)).wait();

  await sleep();

  const aggyCore = AggyCore__factory.connect(aggyCoreAddress, signer);

  // add admin role for all admin accounts
  for (const adminAccount of adminAccounts) {
    await (await aggyCore.grantRole(adminRole, adminAccount)).wait();
    await (await aggyCore.grantRole(verifierRole, adminAccount)).wait();
    await (await aggyTaskFactory.grantRole(adminRole, adminAccount)).wait();
  }

  await sleep();

  console.log('Aggy setup complete');

  // Basic check -------------------------------------------------------------

  const combinedInstructions = await aggyCore.getCombinedInstructions();
  console.log(`Combined instructions readback: ${combinedInstructions}\n`);

  // Setup and run task lifecycle checks --------------------------------------

  const longDeadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 1 week from now
  // const pastDeadline = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 7; // 1 week ago

  const taskSuccess: IAggyTask.TaskDataStruct = {
    name: 'Raise capital',
    id: '3f8c2c74-2a0f-4f1c-bbe7-118fdacfa4a6',
    details: 'Reach out to 10 VCs and offer to sell them 100,000 tokens in exchange for 1% of the tokens.',
    rewardAmount: 100,
    stakeAmount: 100,
    deadline: longDeadline,
  };

  // const taskFail: IAggyTask.TaskDataStruct = {
  //   name: 'Build a research center',
  //   id: 'a7b8f342-4e99-4c29-b8e0-1a2a8b799f0c',
  //   details: 'Interview potential construction firms.',
  //   rewardAmount: 300,
  //   stakeAmount: 400,
  //   deadline: pastDeadline,
  // };
  // const taskCancel: IAggyTask.TaskDataStruct = {
  //   name: 'Rally supporters',
  //   id: '1c3d5ea1-9f6b-4a61-a4c2-bf2d67864e75',
  //   details: 'Start a social media account and post once a week.',
  //   rewardAmount: 50,
  //   stakeAmount: 600,
  //   deadline: longDeadline,
  // };

  await runTaskLifecycle(taskSuccess, 'Happy', aggyCore, aggyTaskFactory, aggyToken, signer, async (taskId) => {
    console.log('Complete work on the task');
    await aggyCore.completeTask(taskId);

    await sleep();

    // console.log('Confirm the task');
    // await aggyCore.confirmTask(taskId);
  });

  // await runTaskLifecycle(taskFail, 'Fail', aggyCore, aggyTaskFactory, aggyToken, signer, async (taskId) => {
  //   console.log('Fail the task');
  //   await aggyCore.failTask(taskId);
  // });

  // await runTaskLifecycle(taskCancel, 'Cancel', aggyCore, aggyTaskFactory, aggyToken, signer, async (taskId) => {
  //   console.log('Cancel the task');
  //   await aggyCore.cancelTask(taskId);
  // });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
