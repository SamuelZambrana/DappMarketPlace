// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

//Imports
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title 
 * @author 
 * @notice 
 * @notice 
 * @dev 
 */
contract MyMarketPlace is Ownable{

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      ATRIBUTOS
     * -----------------------------------------------------------------------------------------------------
     */

    //Referencia al contrato MyCoin
    IERC20 MyCoinContract;
    //Referencia al contrato MyNFTCollection
    IERC721 MyNFTCollectionContract;

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
        MyCoinContract = IERC20(_ERC20Address);
        MyNFTCollectionContract = IERC721(_ERC721Address);
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
     * Incrementa el valor del contador de id de ventas.
     * Es necesario llamarlo justo antes de crear una venta nueva para obtener el id de la venta.
     * Tomad como ejemplo de uso MyNFTCollection.
     */
    function incrementCounter() internal returns(uint256){
        saleIdCounter++;
        return saleIdCounter;
    }

    
    function createSale(uint256 _tokenId, uint256 _price) public{
        
    }

    function buySale(uint256 _saleId) public{
            
    }

    function canceSale(uint256 _saleId) public{

    }

    function getSale(uint256 _saleId) public view returns(Sale memory){

    }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
}