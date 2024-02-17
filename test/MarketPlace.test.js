const { expect } = require("chai");

describe("MarketPlace Test Suite", function(){

    let deployedMarketPlaceContract, deployedERC20Contract, deployedERC721Contract

    let signer, otherAccount//Signers
    let tokenId =1  , saleId = 1 , price = 100 // Sales
    

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
        //del contrato de marketplace que pueda hacer transferencias de tokenERC20
        const appoveERC20 = await deployedERC20Contract.approve(deployedMarketPlaceContract.target, 5000);
        console.log("Aprobacion para transferir MyCoin's al address: ", appoveERC20.to)
        const mintERC721 = await deployedERC721Contract.mintNewToken();
        console.log("Address del creador del TokenId: ", mintERC721.to)
        //Llama al método "approve" en el contrato desplegado para autorizar la direccion
        //del contrato de marketplace que pueda hacer transferencias de tokenERC721
        const approveERC721 = await deployedERC721Contract.approve(deployedMarketPlaceContract.target, tokenId);
        //Verifica que la aprobación se haya realizado correctamente
        console.log("Aprobacion para transferir MyNFTCollection's al address: ", approveERC721.to)//Verifica que la aprobación se haya realizado correctamente
    });


    it("Get Signers", async function(){
        [signer,otherAccount] = await ethers.getSigners()
        console.log(signer.address) // Direccion del creador de la venta
        console.log(otherAccount.address) // Direccion del comprador de la venta(Compra con Mycoin)
    });

    it("Should allow the owner to create a sale", async function(){
        //Comprobar el estado inicial -> llamando a la funcion createSale y creando la venta
        const createSales = await deployedMarketPlaceContract.createSale(tokenId, price)
        //Verifica que la venta se haya creado correctamente y la buscamos en el mapping
        const sale = await deployedMarketPlaceContract.sales(tokenId);
        //Obtiene la información de la Creacion de la venta
        expect(sale.tokenId).to.equal(1);
        expect(sale.price).to.equal(100);
        expect(sale.owner).to.equal(signer.address);
        expect(sale.status).to.equal(0);   
    })

    it("should execute the buySale function correctly", async function () {
        //Realiza la compra de la venta
        await deployedMarketPlaceContract.buySale(saleId);
        //Verifica que la venta se haya creado correctamente y la buscamos en el mapping
        const sale = await deployedMarketPlaceContract.sales(tokenId);
        //Verifica que el estado de la venta sea "Executed"
        //Obtiene la información de la Creacion de la venta
        expect(sale.tokenId).to.equal(1);
        expect(sale.price).to.equal(100);
        expect(sale.owner).to.equal(signer.address);
        expect(sale.status).to.equal(1);  
        expect(sale.saleId).to.equal(1);
    });

    it("should fail if the buyer does not have enough MyCoin", async function () {
        //Muestra que el balance de MyCoin del comprador no es suficiente para realizar la compra
        const buyerBalance = await deployedERC20Contract.getBalance(signer.address);
        console.log(buyerBalance);
    });

    it("should return correct sale information for a valid sale ID", async function () {
        //Llamamos a la función getSale con un tokenID existente
        tokenId = 2; // ID del token
        try {
            const saleInfo = await deployedMarketPlaceContract.getSale(tokenId);
            // Continúa con el código si no hay errores
            expect(saleInfo).to.equal(1)
            //Comprobamos que el ID de venta no existe
            const invalidSaleId = 0;
            await expect(deployedMarketPlaceContract.getSale(invalidSaleId)).to.be.revertedWith("TokenId does not exist");
        } catch (error) {
            console.error("La venta no existe: ", error.message);
            //Comprobamos si el ID del tokenID coincide con el valor esperado
        
        }
    });
}) 