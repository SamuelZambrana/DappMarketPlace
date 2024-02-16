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

    it("Check mintNewToken", async function(){
        //Llama a la función mintNewToken()
        const createToken = await deployedERC721Contract.mintNewToken();
        await createToken.wait();
        //Verifica que el contador sea 0 antes de incrementarlo
        const contadorInicial = await deployedERC721Contract.incrementCounter();
        expect(contadorInicial).to.equal(0);
        //Verifica que se haya emitido un nuevo token
        const tokenId = await deployedERC721Contract.ownerOfToken(ethers.constants.AddressZero, 0);
        expect(tokenId).to.equal(1);
    })

    it("Check Transfer", async function(){
        //Transfiere el tokenId de msg.sender a otherAccount.address
        const result = await deployedERC721Contract.doTransfer(otherAccount.address,tokenId)
        //Verifica que el token se haya transferido correctamente
        const owner = await deployedERC721Contract.ownerOfToken(tokenId);
        expect(owner).to.equal(otherAccount.address);
    })

    it("Check ownerOfToken", async function(){
        //Obtiene la dirección del propietario del token
        const owner = await deployedERC721Contract.ownerOfToken(tokenId);
        //Verifica que la dirección no sea nula o vacía
        expect(owner).to.not.equal(ethers.constants.AddressZero);
    })

})