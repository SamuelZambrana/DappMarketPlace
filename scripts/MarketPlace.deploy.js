const hre = require("hardhat");

const ERC20DeployScript = require("./ERC20.deploy")
const ERC721DeployScript = require("./ERC721.deploy")

let deployedMarketPlaceContract, ERC20DeployScript, ERC721DeployScript
let contractAddress

async function deploy(){
    console.log("MarketPlace deployment has just started...")
    const marketPlaceContract = await ethers.getContractFactory("MyMarketPlace")
    ERC20DeployScript = await deployedERC20Contract.deploy()
    ERC721DeployScript = await deployedERC721Contract.deploy()
    deployedMarketPlaceContract = await marketPlaceContract.deploy(ERC20DeployScript.contractAddress, ERC721DeployScript.contractAddress)
    await deployedMarketPlaceContract.waitForDeployment()
    contractAddress = deployedMarketPlaceContract.target
    console.log("...MarketPlace constract has been deployed to: " + contractAddress)

}

async function verify(){}

async function getContractAddress(){
    return contractAddress
}

module.exports = {deploy,verify,getContractAddress}