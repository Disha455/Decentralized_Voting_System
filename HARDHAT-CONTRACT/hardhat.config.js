require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');
require('dotenv').config(); // For loading environment variables
/*
*@type import('hardhat/config').HardhatUserConfig
*/
const { API_KEY, PRIVATE_KEY } = process.env;
module.exports = {
  solidity: {
    version: "0.8.28", // Make sure to use the appropriate Solidity version for your contract
  },
  networks: {
    hardhat :{},
    moonbaseAlpha: {
      url: "https://rpc.api.moonbase.moonbeam.network", // RPC URL for Moonbase Alpha
      chainId: 1287, // Chain ID for Moonbase Alpha
      accounts: [`0x${PRIVATE_KEY}`], // Private key stored in environment variables
      gas: 2100000,  // Gas limit
      gasPrice: 1000000000 
    },
  },
  etherscan: {
    apiKey: API_KEY, // Etherscan API key for contract verification
  },
};
