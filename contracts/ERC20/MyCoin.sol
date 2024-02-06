// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

//Imports
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title 
 * @author 
 * @notice 
 * @notice 
 * @dev 
 */
contract MyCoin is ERC20, Ownable {

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      ATRIBUTOS
     * -----------------------------------------------------------------------------------------------------
     */

    uint8 public decimal;

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      CONSTRUCTOR
     * -----------------------------------------------------------------------------------------------------
     */

    constructor(uint256 _initialSupply, uint8 _decimal) ERC20("MyCoin", "MYC") {
        _mint(msg.sender, _initialSupply);
        decimal = _decimal;
    }

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      ERRORS
     * -----------------------------------------------------------------------------------------------------
     */

    error BalanceInsuficiente(address sender, uint256 value);

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

    modifier checkBalance(uint256 _value) {
        uint256 actualBalance = getBalance(msg.sender);
        require(actualBalance >= _value, "Insuficcient balance");
        _;
    }

    modifier checkBalance2(uint256 _value) {
        uint256 actualBalance = getBalance(msg.sender);
        if(actualBalance < _value) {
            revert BalanceInsuficiente(msg.sender, _value);
        }
        _;
    }

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

    function getBalance(address _account) public view returns (uint256){
        uint256 balance = balanceOf(_account);
        return balance;
    }

    function doTransfer(address _to, uint256 _value) public checkBalance(_value) returns (bool){
        bool result =transfer(_to, _value);
        return result;
    }

    function decimals() public view override returns(uint8) {
        return decimal;
    }

    function setDecimals(uint8 _decimal) public onlyOwner returns(uint8) {
        decimal = _decimal;
        return decimal;
    }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
}