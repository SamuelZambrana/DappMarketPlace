const { expect} = require("chai");

describe("ERC20 Test Suite", function() {

    let deployedERC20Contract

    let signer, otherAccount

    it("Deploy Contract", async function() {
        const ERC20Contract = await ethers.getContractFactory("MyCoin")
        deployedERC20Contract = await ERC20Contract.deploy(5000,2)
        await deployedERC20Contract.deployed()
        console.log(deployedERC20Contract.address)
    })

    it("Get Signers", async function() {
        [signer,otherAccount] = await ethers.getSigners()
        console.log(signer)
        console.log(otherAccount)
    })      
    
})