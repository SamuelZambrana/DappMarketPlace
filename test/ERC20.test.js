const { expect } = require("chai");

describe("ERC20 Test Suite", function(){

    let deployedERC20Contract

    let signer, otherAccount

    it("Deploy Contract", async function(){
        const ERC20Contract = await ethers.getContractFactory("MyCoin")
        deployedERC20Contract = await ERC20Contract.deploy(5000,2)
        await deployedERC20Contract.waitForDeployment()
        console.log(deployedERC20Contract.target)
    })

    it("Get Signers", async function(){
        [signer,otherAccount] = await ethers.getSigners()
        console.log(signer.address)
        console.log(otherAccount.address)
    })

    it("Check Balance", async function(){
        const balance = await deployedERC20Contract.getBalance(signer.address)
        expect(balance).to.equal(5000)

        const balance2 = await deployedERC20Contract.getBalance(otherAccount.address)
        expect(balance2).to.equal(0)
    })

    it("Check Transfer", async function(){
        const result = await deployedERC20Contract.doTransfer(otherAccount.address,3000)

        const balance = await deployedERC20Contract.getBalance(signer.address)
        expect(balance).to.equal(2000)

        const balance2 = await deployedERC20Contract.getBalance(otherAccount.address)
        expect(balance2).to.equal(3000)
    })

    it("Check Mint", async function(){
        //compruebe el saldo inicial
        const balance = await deployedERC20Contract.getBalance(signer.address)
        expect(balance).to.equal(2000)

        const balance2 = await deployedERC20Contract.getBalance(otherAccount.address)
        expect(balance2).to.equal(3000)

        //haga el minteo
        const mint = await deployedERC20Contract.mintNewTokens(3000,otherAccount.address)

        //compruebe el saldo final
        const balanceFinal2 = await deployedERC20Contract.getBalance(otherAccount.address)
        expect(balanceFinal2).to.equal(6000)

    })


}) 