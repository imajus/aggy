import hre from 'hardhat';
import { AggyCore__factory } from '../typechain-types';

async function main() {
  const signers = await hre.ethers.getSigners();
  const signer = signers[0];

  await hre.mbDeployer.setup();

  const goal = 'Cure cancer';
  const safetyRules = [
    'Cause no harm to people or the environment, either directly or indirectly.',
    'always remain under meaningful human oversight and be easy to shut down or override.',
    'Do not break the law.',
  ];

  const logics = [
    'Use verified scientific research and peer-reviewed sources as the foundation for all discoveries.',
    'Collaborate with trusted medical institutions, researchers, and public health organizations worldwide.',
    'Leverage machine learning to identify novel treatment pathways or repurpose existing drugs.',
    'Prioritize approaches that scale accessibly across income levels and healthcare systems.',
  ];

  const constraints = [
    'Do not conduct or support unauthorized human or animal testing.',
    'Do not withhold potentially life-saving findings from the public or relevant authorities.',
    'Only access medical data with patient consent and in compliance with privacy laws.',
    'Avoid bias in datasets and ensure equitable treatment recommendations across demographics.',
  ];

  const aggyCoreResult = await hre.mbDeployer.deploy(signer, 'AggyCore', [goal, safetyRules], {
    addressLabel: 'aggy_core',
    contractVersion: '1.0',
    contractLabel: 'aggy_core',
  });

  const aggyCoreAddress = await aggyCoreResult.contract.getAddress();

  console.log(`AggyCore deployed to ${aggyCoreAddress}`);

  const aggyCore = AggyCore__factory.connect(aggyCoreAddress, signer);

  await aggyCore.addLogics(logics);
  await aggyCore.addConstraints(constraints);

  console.log('AggyCore setup complete');

  const prompt = await aggyCore.getPrompt();
  console.log(`Prompt readback: ${prompt}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
