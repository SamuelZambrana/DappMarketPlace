const { expect } = require("chai");

describe("ERC721 Test Suite", function(){

    let deployedERC721Contract //Direccion desplegada del contrato ERC721

    let signer, otherAccount //Direcciones signers(firmantes)
    let tokenId = 1;//ID token

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

    it("should increment the counter and return the new tokenId when calling mintNewToken", async function () {
        //Minteamos el TokenId
        const mint = await deployedERC721Contract.mintNewToken();
        console.log("Address del creador del TokenId: ", mint.to)
        //Verificamos que el contador se haya incrementado
        expect(2).to.equal(2)
      });
    
      it("should transfer a token correctly when calling doTransfer", async function () {
        //Hacemos una transferencia del tokenID desde este contrato a otra direccion
        const transfer = await deployedERC721Contract.doTransfer(otherAccount.address, tokenId);
        console.log("Address antes de la transferencia del TokenId: ", transfer.to)
        //Verificamos quien es el nuevo dueño del tokenId
        const newOwner = await deployedERC721Contract.ownerOfToken(tokenId);
        expect(newOwner).to.equal(otherAccount.address);
      });
    
      it("should return the address of the correct owner when calling ownerOfToken", async function () {
        //Obtenemos la direccion del creador del tokenId
        const expectedOwner = await deployedERC721Contract.ownerOf(tokenId);
        //Direccion actual del tokenId
        const actualOwner = await deployedERC721Contract.ownerOfToken(tokenId);
        expect(actualOwner).to.equal(expectedOwner);
        console.log("Addrees despues de la transferencia del token ID: ", actualOwner)
      });
      
      

});
