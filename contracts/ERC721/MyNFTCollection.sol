// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

//Imports
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title 
 * @author 
 * @notice 
 * @notice 
 * @dev 
 */
contract MyNFTCollection is ERC721, Ownable{

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      ATRIBUTOS
     * -----------------------------------------------------------------------------------------------------
     */

    uint256 public tokenIdCounter = 0;

    mapping(uint256 => uint8) public tokenTypeMap;

    string public baseTokenURI;

    

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      CONSTRUCTOR
     * -----------------------------------------------------------------------------------------------------
     */

    constructor(string memory _name, string memory _symbol, string memory _baseTokenURI)ERC721(_name, _symbol){
        baseTokenURI = _baseTokenURI;
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

    event TokenMinted(address indexed minter, uint256 tokenId);

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      FUNCIONES
     * -----------------------------------------------------------------------------------------------------
     */

    function incrementCounter() internal returns(uint256){
        tokenIdCounter++;
        return tokenIdCounter;
    }

    function mintNewToken(uint8 _tokenType) public returns(uint256){
        uint256 tokenId = incrementCounter(); 
        _mint(msg.sender, tokenId);
        tokenTypeMap[tokenId] = _tokenType;
        emit TokenMinted(msg.sender, tokenId);
        return tokenId;
    }

    function doTransfer(address _to, uint256 _tokenId) public {
        safeTransferFrom(msg.sender, _to, _tokenId);
    }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
}