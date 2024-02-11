require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(
  {path:".env"}
);

const ALCHEMY_HTTP_KEY = process.env.ALCHEMY_HTTP_KEY
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY

// const { ALCHEMY_HTTP_KEY, DEPLOYER_PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks:{
    mumbai:{
      url:ALCHEMY_HTTP_KEY,
      accounts: [DEPLOYER_PRIVATE_KEY]
    }
  }
};
