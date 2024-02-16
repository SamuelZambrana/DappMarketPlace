const { expect } = require("chai");

describe("MarketPlace Test Suite", function(){

    let deployedMarketPlaceContract, deployedERC20Contract, deployedERC721Contract

    let signer, otherAccount//Signers
    let tokenId, saleId, price, buyer // Sales

    it("Deploy Contract ERC20", async function(){
        const ERC20Contract = await ethers.getContractFactory("MyCoin")
        deployedERC20Contract = await ERC20Contract.deploy(5000,2)
        await deployedERC20Contract.waitForDeployment()
        console.log(deployedERC20Contract.target)
    })

    it("Deploy Contract ERC721", async function(){
        const ERC71Contract = await ethers.getContractFactory("MyNFTCollection")
        deployedERC721Contract = await ERC71Contract.deploy("NFTCollection","CoNFT")
        await deployedERC721Contract.waitForDeployment()
        console.log(deployedERC721Contract.target)
    })
    

    it("Deploy Contract MarketPlace", async function(){
        const marketPlaceContract = await ethers.getContractFactory("MyMarketPlace")
        deployedMarketPlaceContract = await marketPlaceContract.deploy(deployedERC20Contract.target, deployedERC721Contract.target)
        await deployedMarketPlaceContract.waitForDeployment()
        console.log(deployedMarketPlaceContract.target)
        //Llama al método "approve" en el contrato desplegado para autorizar la direccion
        //del contrato de marketplace que pueda hacer transferencias.
        await deployedMarketPlaceContract.approveERC20(deployedMarketPlaceContract.target, 5000);
        //await deployedMarketPlaceContract.approveERC721(deployedMarketPlaceContract.target, tokenId);
        //Verifica que la aprobación se haya realizado correctamente
        /*const approvalStatus = await deployedMarketPlaceContract.allowance(
        ownerAddress,
        tokenContractAddress);
        //Verifica que la direccion del contrato marketplace es la direccion autorizada
        expect(approvalStatus).to.equal(tokenContractAddress, "This is not the authorized address to make the transfer");
        */
    });


    it("Get Signers", async function(){
        [signer,otherAccount,tokenContractAddress, ownerAddress] = await ethers.getSigners()
        console.log(signer.address) // Direccion del creador de la venta
        console.log(otherAccount.address) // Direccion del comprador de la venta(Compra con Mycoin)
    });

    it("Should allow the owner to create a sale", async function(){
        //Comprobar el estado inicial -> llamando a la funcion createSale y creando la venta
        const createSale = await deployedMarketPlaceContract.createSale(1, 100)
        //Verifica que la venta se haya creado correctamente y la buscamos en el mapping
        /*const sale = await deployedMarketPlaceContract.sales(tokenId);
        //Comprobar el estado final  -> si el dueño de la venta es el correcto.
        expect(deployedMarketPlaceContract.Sale.owner).to.equal(await ethers.getSigner().getAddress(), "The owner of the sale is not correct");
        //Comprobar el estado final  -> si el precio de la venta es el correcto.
        expect(deployedMarketPlaceContract.Sale.price).to.equal(price, "The sale price is not correct");
        //Comprobar el estado final  -> si el estatus de la venta es el correcto, debe estar Open pa"El precio de la venta no es correcto"ra crear la venta
        expect(deployedMarketPlaceContract.Sale.status).to.equal("Open");
        */ 
    })
})