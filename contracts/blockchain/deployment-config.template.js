const deploymentConfig = {
  // Private key of the deployer account, beginning with 0x
  deployerPrivateKey: '0x0000000000000000000000000000000000000000000000000000000000000000',

  // Full URL such as https://abc123.multibaas.com
  deploymentEndpoint: 'https://<DEPLOYMENT ID>.multibaas.com',

  // The chain ID of the blockchain network
  // For example: Curvegrid test network = 2017072401, Ethereum Mainnet = 1, BSC Testnet = 97, BSC Mainnet = 56, Ethereum Sepolia = 11155111
  ethChainID: 2017072401,

  // API key to access MultiBaas web3 endpoint
  // Note that the API key MUST be part of the "Web3" group
  // Create one on MultiBaas via navigation bar > Admin > API Keys
  web3Key: '<API KEY IN WEB3 GROUP>',

  // RPC URL of the blockchain network is required if a web3Key is not provided
  // This is required for networks that where MultiBaas does not support the web3 proxy feature
  rpcUrl: '',

  // API key to access MultiBaas from deployer
  // Note that the API key MUST be part of the "Administrators" group
  // Create one on MultiBaas via navigation bar > Admin > API Keys
  adminApiKey: '<API KEY IN ADMINISTRATOR GROUP>',
};

module.exports = {
  deploymentConfig,
};
