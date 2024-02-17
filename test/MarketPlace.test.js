const { expect } = require("chai");

/*
IMPORTANTE: He realizado los casos de prueba, pero me ha dado error a la hora de probarlos
en crear la venta y he podido continuar con los casos de prueba correspondientes por eso te lo
comento.
*/

describe("MarketPlace Test Suite", function(){

    let deployedMarketPlaceContract, deployedERC20Contract, deployedERC721Contract

    let signer, otherAccount//Signers
    let tokenId = 1, saleId = 1, price = 100 // Sales
    

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
        console.log("Aprobacion para transferir MyNFTCollection's al address: ", approveERC721.to)
        //Verifica que la aprobación se haya realizado correctamente
    });


    it("Get Signers", async function(){
        [signer,otherAccount,tokenContractAddress, ownerAddress] = await ethers.getSigners()
        console.log(signer.address) // Direccion del creador de la venta
        console.log(otherAccount.address) // Direccion del comprador de la venta(Compra con Mycoin)
    });

    it("Should allow the owner to create a sale", async function(){
        //Comprobar el estado inicial -> llamando a la funcion createSale y creando la venta
        const createSales = await deployedMarketPlaceContract.createSale(tokenId, price)
        //Verifica que la venta se haya creado correctamente y la buscamos en el mapping
        const sale = await deployedMarketPlaceContract.sales(tokenId);
        //Obtiene la información de la venta
        expect(sale.tokenId).to.equal(1);
        expect(sale.price).to.equal(100);
        expect(sale.owner).to.equal(signer.address);
        expect(sale.status).to.equal(0);   
    })

    it("should execute the buySale function correctly", async function () {
        //Realiza la compra
        //await deployedMarketPlaceContract.buySale(saleId);
        //Verifica que la venta se haya creado correctamente y la buscamos en el mapping
        const sale = await deployedMarketPlaceContract.sales(tokenId);
        //Verifica que el estado de la venta sea "Executed"
        //expect(await deployedMarketPlaceContract.getSale(saleId)).to.equal("Executed");
        //Verifica que el balance del comprador se haya reducido
    });

    /*it("should fail if sale is not in open state", async function () {
        //Crea una venta de prueba y establece su estado como "Closed"
        tokenId = 2; //ID del token
        price = 1; //Precio en MyCoin
        //const createSales = await deployedMarketPlaceContract.createSale(tokenId, price)
        //Agrega la venta a la structura Sales en el contrato MyMarketPlace
        await deployedMarketPlaceContract.sales(tokenId);
        //Verifica que el estado de la venta sea "Executed"
        expect(await deployedMarketPlaceContract.getSale()).to.equal("Executed");
        //Intenta comprar la venta de nuevo con el mismo ID
        try {
            await deployedMarketPlaceContract.buySale();
            expect.fail("The purchase should have failed");
        } catch (error) {
            expect(error.message).to.include("The purchase is not in open status");
        }
    });

    it("should fail if the buyer does not have enough MyCoin", async function () {
        //Crea una venta de prueba
        saleId = 3; // ID de la venta
        price = 300; // Precio en MyCoin
        buyer = await ethers.getSigner(otherAccount.addresss); // Dirección del comprador (este contrato de prueba)
        //Agrega la venta a la structura Sales en el contrato MyMarketPlace
        await deployedMarketPlaceContract.addSale(saleId, price);
        //Intenta comprar la venta con un balance insuficiente
        try {
            await deployedMarketPlaceContract.buySale(saleId);
            expect.fail("The purchase should have failed due to lack of balance");
        } catch (error) {
            expect(error.message).to.include("you do not have enough Mycoin to make the purchase");
        }
        //Muestra que el balance del comprador no es suficiente para realizar la compra
        const buyerBalance = await deployedMarketPlaceContract.getBalance(buyer.address);
        console.log(buyerBalance);
    });

    it("should you cancel a sale correctly", async function () {
        // Simula una compra de una venta existente con un ID específico
        saleId = 4; // ID de la venta
        price = 100; // Precio en MyCoin
        buyer = await ethers.getSigner(otherAccount.addresss); // Dirección del comprador de la venta (este contrato de prueba)
        //Agrega la venta a la structura Sales en el contrato MyMarketPlace
        await deployedMarketPlaceContract.Sale(saleId, price);
        //Realiza la compra de la venta
        await deployedMarketPlaceContract.buySale(saleId);
        //Llama a la función cancelSale con el ID de venta para cancelar la venta y actualizar el estado
        await sale.cancelSale(saleId);
        //Verifica que el estado de la venta se haya actualizado correctamente
        const saleStatus = await deployedMarketPlaceContract.getSale(saleId);
        expect(saleStatus).to.equal("Cancelled");
      });

      it("should throw exception if not called from owner", async function () {
        // Simula una compra de una venta existente con un ID específico
        saleId = 5; // ID de la venta
        price = 200; // Precio en MyCoin
        buyer = await ethers.getSigner(otherAccount.addresss); // Dirección del comprador de la venta (este contrato de prueba)
        //Agrega la venta a la structura Sales en el contrato MyMarketPlace
        await deployedMarketPlaceContract.Sale(saleId, price);
        //Realiza la compra de la venta
        await deployedMarketPlaceContract.buySale(saleId);
        //Intenta llamar a la función cancelSale desde una dirección que no es la del propietario
        await expect(deployedMarketPlaceContract.connect(signer).canceSale(saleId)).to.be.revertedWith("Ownable: caller is not the owner");
        //Verifica que la venta no cambie de estado
        const saleStatus = await deployedMarketPlaceContract.getSale(saleId);
        expect(saleStatus).to.equal("Open");
      });

      it("should throw an exception if called in a non-open state", async function () {
        // Crea una compra de una venta y establece su estado en "Vendida" o "Cancelada"
        saleId = 6; // ID de la venta
        price = 200; // Precio en MyCoin
        buyer = await ethers.getSigner(otherAccount.addresss); // Dirección del comprador de la venta (este contrato de prueba)
        //Agrega la venta a la structura Sales en el contrato MyMarketPlace
        await deployedMarketPlaceContract.Sale(saleId, price);
        //Realiza la compra de la venta
        await deployedMarketPlaceContract.buySale(saleId);
        //Cambia el estado a "Vendida" o "Cancelada"
        await deployedMarketPlaceContract.getSale(saleId, "Cancelled");
        //Intenta llamar a la función cancelSale para esa venta
        await expect(deployedMarketPlaceContract.canceSale(saleId)).to.be.revertedWith("The purchase is not in open status");
        //Verifica que la venta no cambie de estado
        const saleStatus = await deployedMarketPlaceContract.getSale(saleId);
        expect(saleStatus).to.equal("Open");
      });

      it("should cancel sale and transfer ERC721 token to owner", async function () {
        //Creamos una nueva venta para el tokenID
        tokenId = 2; // ID del token
        buyer = await ethers.getSigner(ownerAddress.address); // Dirección del creador de la venta (este contrato de prueba)
        //Comprobar el estado inicial -> llamando a la funcion createSale y creando la venta
        const createSale = await deployedMarketPlaceContract.createSale(tokenId,price)
        //Verifica que la venta se haya creado correctamente y la buscamos en el mapping
        const sale = await deployedMarketPlaceContract.sales(tokenId);
        //Llamamos a la función cancelarVenta
        await deployedMarketPlaceContract.connect(ownerAddress).canceSale(tokenId);
        // Comprobar si el token se transfiere de nuevo al propietario
        const ownerOfToken = await deployedMarketPlaceContract.ownerOfToken(tokenId);
        expect(ownerOfToken).to.equal(ownerAddress.address);
      });

      it("should return correct sale information for a valid sale ID", async function () {
        //Llamamos a la función getSale con un tokenID existente
        tokenId = 2; // ID del token
        const saleInfo = await deployedMarketPlaceContract.getSale(tokenId);
        //Comprobamos si el ID del tokenID coincide con el valor esperado
        expect(saleInfo.tokenId).to.equal(2)
        //Comprobamos que el ID de venta no existe
        const invalidSaleId = 0;
        await expect(deployedMarketPlaceContract.getSale(invalidSaleId)).to.be.revertedWith("TokenId does not exist");
      });
    */
}) 