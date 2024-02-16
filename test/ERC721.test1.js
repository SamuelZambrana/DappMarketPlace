const { expect } = require("chai");

describe("ERC721 Test Suite", function(){

    let deployedERC721Contract //Direccion desplegada del contrato ERC721

    let signer, otherAccount //Direcciones signers(firmantes)
    let tokenId //ID token

    it("Deploy Contract ERC721", async function(){
        const ERC721Contract = await ethers.getContractFactory("MyNFTCollection")
        deployedERC721Contract = await ERC721Contract.deploy("NFTCollection","CoNFT")
        await deployedERC721Contract.waitForDeployment()
        console.log(deployedERC721Contract.target)
    })

    it("Get Signers", async function(){
        [signer,otherAccount] = await ethers.getSigners()
        console.log(signer.address)
        console.log(otherAccount.address)
    })

    it("debería incrementar el contador y devolver el nuevo tokenId al llamar a mintNewToken", async function () {
        const tokenId = await deployedERC721Contract.mintNewToken();
        expect(tokenId).to.be.a("number");
      });
    
      it("debería transferir un token correctamente al llamar a doTransfer", async function () {
    
        await deployedERC721Contract.doTransfer(otherAccount.address, tokenId);
        const newOwner = await deployedERC721Contract.ownerOfToken(tokenId);
    
        expect(newOwner).to.equal(otherAccount.address);
      });
    
      it("debería devolver la dirección del propietario correcto al llamar a ownerOfToken", async function () {
        const expectedOwner = await deployedERC721Contract.ownerOf(tokenId);
    
        const actualOwner = await deployedERC721Contract.ownerOfToken(tokenId);
        expect(actualOwner).to.equal(expectedOwner);
      });

});
