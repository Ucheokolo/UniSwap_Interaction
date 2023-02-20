// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface iLiquidityToken {
    // get balance of provided address.
    function balanceOf(address account) external view returns (uint256);

    // in this case msg.sender is the sender and must have a minimum of passed in amount in his balance.
    function transfer(address to, uint256 amount) external returns (bool);

    // in this case msg.sender is giving approval for a specific spender(an address or smartContract address) to access funds in his account to the tune of the amount specified.
    function approve(address spender, uint256 amount) external returns (bool);

    // in this case you input onwer address and spender address to reveal how much funds spender is allowed to access.
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);
}
