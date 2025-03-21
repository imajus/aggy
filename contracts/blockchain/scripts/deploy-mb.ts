import hre from 'hardhat';

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

  const aggyCore = await hre.mbDeployer.deploy(signer, 'AggyCore', [goal, safetyRules], {
    addressLabel: 'aggy_core',
    contractVersion: '1.0',
    contractLabel: 'aggy_core',
  });

  console.log(`AggyCore deployed to ${await aggyCore.contract.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
