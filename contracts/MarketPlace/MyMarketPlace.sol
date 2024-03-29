// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

//Imports
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IMyCoin} from "../ERC20/IMyCoin.sol";
import {IMyNFTCollection} from "../ERC721/IMyNFTCollection.sol";

/**
 * @title Mercado para el intercambio de tokens
 * @author Samuel Zambrana Gonzalez
 * @notice Contrato reliacionado a la compra, venta y transferencia de tokens
 * donde podemos ver todo relacionado con una venta , desde crearla hasta ver 
 * comprarla ,cancelarla o ver si existe. Iteractuamos con los contratos MyCoin 
 * que sera la moneda de pago y el contrato MyNFTCollection que sera el tokenId
 * que sera expuesto en la venta.
 * @notice 
 * @dev Cada funcion esta explicada en la parte superior, David @perdiweb3
 */
contract MyMarketPlace is Ownable{

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      ATRIBUTOS
     * -----------------------------------------------------------------------------------------------------
     */

    //Referencia al contrato MyCoin
    IMyCoin MyCoinContract;
    //Referencia al contrato MyNFTCollection
    IMyNFTCollection MyNFTCollectionContract;

    //Contador para los id de las Sales
    uint256 public saleIdCounter = 0;

    //Estados posibles de una venta
    //https://docs.soliditylang.org/en/v0.8.19/types.html#enums
    enum SaleStatus {
        //Cuando se crea una venta el estado es Open
        Open,
        //Cuando se compra una venta el estado es Executed
        Executed,
        //Cuando se cancela una venta el estado es Cancelled
        Cancelled
    }

    //Contiene toda la informacion de una venta
    struct Sale{
        //Id de la venta
        uint256 saleId;
        //Propietario del token y de la venta
        address owner;
        //Id del token ERC721 (NFT)
        uint256 tokenId;
        //Cantidad de tokens ERC20 que tiene que pagar el comprador
        uint256 price;
        //Estado de la venta
        SaleStatus status;
    }

    //Relaciona el id de la venta con el objeto Sale que contiene la informacion
    mapping(uint256 => Sale) public sales;
    

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      CONSTRUCTOR
     * -----------------------------------------------------------------------------------------------------
     */

    /**
     * Inicializa las referencias a los contratos. 
     * @dev Se pasan por parametro en la funcion deploy.
     * @param _ERC20Address address del contrato ERC20.
     * @param _ERC721Address address del contrato ERC721
     */
    constructor(address _ERC20Address, address _ERC721Address){
        MyCoinContract = IMyCoin(_ERC20Address);
        MyNFTCollectionContract = IMyNFTCollection(_ERC721Address);
    }

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      ERRORS
     * -----------------------------------------------------------------------------------------------------
     */

    /**
     * Los errores son lanzados mediante la instruccion revert, normalmente despues de comprobar una condicion.
     * El nombre del error explica cual es el motivo por el se ha revertido la transaccion. 
     * Para mas informacion, buscar la condicion en la que se lanza el error.
     */

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      MODIFIERS
     * -----------------------------------------------------------------------------------------------------
     */

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      EVENTS
     * -----------------------------------------------------------------------------------------------------
     */

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      FUNCIONES
     * -----------------------------------------------------------------------------------------------------
     */

    /**
     * @notice Incrementa el valor del contador de id de ventas.
     * Es necesario llamarlo justo antes de crear una venta nueva para obtener el id de la venta.
     * @notice
     * @dev Tomad como ejemplo de uso MyNFTCollection.
     * @return Retorna la variable saleIdCounter incrementada
     */
    function incrementCounter() internal returns(uint256){
        saleIdCounter++;
        return saleIdCounter;
    }
    /**
     * @notice Creamos una venta de un tokenID y le ponemos un precio.
     * Solo puede crear la venta el dueño del tokenID
     * Lo guardamos ese tokenID en el mapping y creamos una nueva instancia de la estructura de sale
     * para guardar los datos de la nueva venta
     * Hacemos la transferencia del tokenID desde la direccion del dueño del token a la direcion de este 
     * contrato MyMarketPlace
     * @notice
     * @param _tokenId  hace referencia a un elemento de la estructura Sale que despues
     * se guarda en el mapping y poniendo su ID accedemos a toda la estructura para buscar
     * la informacion de la creacion de la venta relacionada a ese TokenId
     * @param _price  hace referemcia al precio que se le pone al tokenID cuando se
     * crea la venta y se alamcena en la estructura guardad en el mapping
     * @dev Al crear ña vemta se incrementa el ID de la venta, David @perdiweb3
     */
   function createSale(uint256 _tokenId, uint256 _price) public {
        //Comprueba que el llamante sea el dueño del token
        require(MyNFTCollectionContract.ownerOfToken(_tokenId) == msg.sender, "You are not the owner of the token");
        //Creamos una instancia para crear una nueva estructura y rellenamos la informacion recibida por parametro
        Sale memory newSale = Sale({
            tokenId: _tokenId,
            price: _price,
            owner: msg.sender,
            status:  SaleStatus.Open,
            saleId: incrementCounter()
        });
        //Guardamos el tokenID en nuestro mapping con los datos de la nueva estructura
        sales[_tokenId] = newSale;
        //Transfiere el token ERC721 al contrato MyMarketPlace
        MyNFTCollectionContract.transferFrom(msg.sender, address(this), _tokenId);

    }
     /**
     * @notice Creamos la compra de una venta de un tokenID 
     * Lo guardamos ese id de venta saleId en el mapping y creamos una nueva instancia de la estructura de sale
     * para guardar los datos de la nueva compra de una venta del token.
     * Nos aseguramos que la venta esta en estado abierto para poder comprar.
     * Nos aseguramos que el comprador tiene suficiente Mycoin para realizar la venta
     * Hacemos la compra del token ERC721, primero la transferencia del comprador en este caso paga con Mycoin
     * y despues la transferencia del dueño del token erc721 al comprador.
     * Finalmente se actualiza el status a Executed, queda como comprado.
     * @notice 
     * @param _saleId Se introducce como parametro el ID de la venta creado por la funcioncreateSale
     * @dev Al introduccir un ID no valido se revierte la operacion, David @perdiweb3
     */
    function buySale(uint256 _saleId) public {
        //Creamos una instancia del Objeto Sale para guardar el _saleId en nuestro mapping sales.
        Sale storage buysale = sales[_saleId];
        //Comprueba que la venta esta en estado abierto para que se pueda realizar la compra
        require(buysale.status == SaleStatus.Open, "The purchase is not in open status");
        //Comprueba que el comprador tiene suficiente MyCoin para realizar la compra
        require(MyCoinContract.getBalance(msg.sender) >= buysale.price, "you do not have enough Mycoin to make the purchase");
        //Transfiere los MyCoin desde el comprador al vendedor
        MyCoinContract.transferFrom(msg.sender, address(this), buysale.price);
        // Transfiere el token ERC721 desde MyMarketPlace al comprador
        MyNFTCollectionContract.transferFrom(address(this), msg.sender, _saleId);
        // Actualiza el estado de la compra a ejecutado
        buysale.status = SaleStatus.Executed;
    }
    /**
     * @notice Creamos la cancelacion de una venta de un tokenID 
     * Lo guardamos ese id de venta saleId en el mapping y creamos una nueva instancia de la estructura de sale
     * para guardar los datos de la cancelacion de una venta del token.
     * Nos aseguramos que la venta esta en estado abierto para poder comprar.
     * Hacemos la cancelacion del token ERC721, haciendo la transferencia desde este contrato de mymarketplace
     * a la direccion del dueño del token erc721 devolviendole su token
     * Finalmente se actualiza el status a cancelled, queda como cancelado.
     * @notice
     * @param _saleId Se introducce como parametro el ID de la venta creado por la funcioncreateSale
     * @dev Al introduccir un ID no valido se revierte la operacion, David @perdiweb3
     */
    function canceSale(uint256 _saleId) public{
        //Creamos una instancia del Objeto Sale para guardar el _saleId en nuestro mapping sales.
        Sale storage cancelsale = sales[_saleId];
        //Comprueba que la venta esta en estado abierto para que se pueda realizar la compra
        require(cancelsale.status == SaleStatus.Open, "The purchase is not in open status");
        //Devuelve el token ERC721 desde MyMarketPlace al propietario
        MyNFTCollectionContract.transferFrom(address(this), msg.sender, _saleId);
        // Actualiza el estado de la compra a cancelado
        cancelsale.status = SaleStatus.Cancelled;
    }
     /**
     * @notice Ontenemos la informacion de una venta de un tokenID 
     * @notice
     * @param _saleId Se introducce como parametro el ID de la venta creado por la funcioncreateSale
     * @dev Al introduccir un ID no valido o 0 se revierte la operacion, David @perdiweb3
     * @return Sale, Devuelve la  estructura de datos del ID de la venta que almacenamos en memoria
     */
    function getSale(uint256 _saleId) public view returns(Sale memory){
        //Comprueba que el ID no sea 0
        require(_saleId > 0, "El ID de venta debe ser mayor que cero");
        //Comprueba que el ID introduccido sea igual a un ID existente almacenado en el mapping, es decir que ya existe
        require(sales[_saleId].saleId == _saleId, "La venta no existe");
        //Devuelve la información de la venta
        return sales[_saleId];
    }

}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      