const hre = require("hardhat");

const ERC20DeployScript = require("./ERC20.deploy")
const ERC721DeployScript = require("./ERC721.deploy")

let deployedMarketPlaceContract
let contractAddress

async function deploy(){
    console.log("MarketPlace deployment has just started...")
    const marketPlaceContract = await ethers.getContractFactory("MyMarketPlace")
    // Despliega los contratos ERC20 y ERC721
    const erc20Contract = await ERC20DeployScript.deploy()
    const erc721Contract = await ERC721DeployScript.deploy()
    // Pasa las direcciones de los contratos como parámetros al contrato de MarketPlace
    deployedMarketPlaceContract = await marketPlaceContract.deploy(erc20Contract, erc721Contract)
    await deployedMarketPlaceContract.waitForDeployment()
    contractAddress = deployedMarketPlaceContract.target
    console.log("...MarketPlace constract has been deployed to: " + contractAddress)

}

async function verify(){}

async function getContractAddress(){
    return contractAddress
}

module.exports = {deploy,verify,getContractAddress}