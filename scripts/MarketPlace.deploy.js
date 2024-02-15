const hre = require("hardhat");

let deployedMarketPlaceContract
let contractAddress

async function deploy(){
    console.log("MarketPlace deployment has just started...")
    const marketPlaceContract = await ethers.getContractFactory("MyMarketPlace")
    deployedMarketPlaceContract = await marketPlaceContract.deploy("","")
    await deployedMarketPlaceContract.waitForDeployment()
    contractAddress = deployedMarketPlaceContract.target
    console.log("...MarketPlace constract has been deployed to: " + contractAddress)

}

async function verify(){}

async function getContractAddress(){
    return contractAddress
}

module.exports = {deploy,verify,getContractAddress}