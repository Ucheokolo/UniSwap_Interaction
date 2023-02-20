// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface ifactory {
    function getPair(address tokenA, address tokenB)
        external
        view
        returns (address pair);
}

interface IUniswapV2Pair {
    function approve(address spender, uint256 value) external returns (bool);
}
