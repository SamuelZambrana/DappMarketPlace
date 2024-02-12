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

    IERC20 MyCoinContract;
    IERC721 MyNFTCollectionContract;

    uint256 public saleIdCounter = 0;

    enum SaleStatus {
        Open,
        Executed,
        Cancelled
    }

    struct Sale{
        address owner;
        uint256 tokenId;
        uint256 price;
        string status;
    }

    mapping(uint256 => Sale) public sales;



    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      CONSTRUCTOR
     * -----------------------------------------------------------------------------------------------------
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

    function incrementCounter() internal returns(uint256){
        saleIdCounter++;
        return saleIdCounter;
    }

    function createSale(uint256 _tokenId, uint256 _price) public{
        
    }

    function buySale(uint256 _saleId) public{
        
    }

    function canceSale() public{

    }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
}