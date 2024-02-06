const { expect } = require("chai");

describe("ERC20 Test Suite", function(){

    let deployedERC20Contract

    let signer, otherAccount

    it("Deploy Contract", async function(){
        
    })

    it("Get Signers", async function(){
        [signer,otherAccount] = await ethers.getSigners()
        console.log(signer.address)
        console.log(otherAccount.address)
    })
})