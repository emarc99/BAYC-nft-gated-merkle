// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public _owner;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 supply_,
        address account_
    ) ERC20(name_, symbol_) {
        _owner = msg.sender;
        _mint(account_, supply_);
    }

    function mintMoreTokens(uint256 _amount) external {
        require(msg.sender == _owner, "Only owner can mint!");
        _mint(_owner, _amount);
    }
}
