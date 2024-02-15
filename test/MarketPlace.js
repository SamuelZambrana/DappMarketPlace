const { expect } = require("chai");

describe("MarketPlace Test Suite", function(){

    let deployedMarketPlaceContract

    let signer, otherAccount, tokenContractAddress, ownerAddress //Signers
    let tokenId, saleId, price, buyer // Sales

    it("Deploy Contract", async function(){
        const marketPlaceContract = await ethers.getContractFactory("MyMarketPlace")
        deployedMarketPlaceContract = await marketPlaceContract.deploy("","")
        await deployedMarketPlaceContract.waitForDeployment()
        console.log(deployedMarketPlaceContract.target)
        const amount = 100
        //Llama al método "approve" en el contrato desplegado para autorizar la direccion
        //tokenContractAddress que pueda hacer transferencias.
        await deployedMarketPlaceContract.approve(tokenContractAddress, amount);
        //Verifica que la aprobación se haya realizado correctamente
        const approvalStatus = await deployedMarketPlaceContract.allowance(
        ownerAddress,
        tokenContractAddress);
        //Verifica que la direccion del contrato marketplace es la direccion autorizada
        expect(approvalStatus).to.equal(tokenContractAddress, "This is not the authorized address to make the transfer");
    });


    it("Get Signers", async function(){
        [signer,otherAccount,tokenContractAddress, ownerAddress] = await ethers.getSigners()
        console.log(signer.address) // Direccion del creador de la venta
        console.log(otherAccount.address) // Direccion del comprador de la venta(Compra con Mycoin)
        console.log(tokenContractAddress.address) // Direccion del contrato MyMarketPlace
        console.log(ownerAddress.address) // Direccion del dueño del TokenID
    });

})