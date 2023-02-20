import { ethers } from "hardhat";
import { string } from "hardhat/internal/core/params/argumentTypes";

async function main() {

    // UniSwap contract Address iUniSwap interface
    const Router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    // UNI token address
    const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

    // LINK token address
    const LINK = "0x514910771AF9Ca656af840dff83E8264EcF986CA";

    // USDC token Address
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

    // Uni factory Contract
    const UniFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";


    // Access all token contracts via their interface..
    const UniSwap = await ethers.getContractAt("iUniSwap", Router);
    const UniToken = await ethers.getContractAt("iLiquidityToken", UNI);
    const LinkToken = await ethers.getContractAt("iLiquidityToken", LINK);
    const DaiToken = await ethers.getContractAt("iLiquidityToken", DAI);
    const UsdcToken = await ethers.getContractAt("iLiquidityToken", USDC);
    const factoryContract = await ethers.getContractAt("ifactory", UniFactory);

    // create impersonator details.
    const helpers = require("@nomicfoundation/hardhat-network-helpers");
    const ImpersonatorAddress = "0x864894Af6B4A911F4d34C2E5aeAADfe2B012c15D";
    await helpers.impersonateAccount(ImpersonatorAddress);
    const impersonatedSigner = await ethers.getSigner(ImpersonatorAddress);

    // Confirm Impersonator has sufficient balance
    const impersonatorBalUni = await UniToken.balanceOf(impersonatedSigner.address);
    const impersonatorBalLink = await LinkToken.balanceOf(impersonatedSigner.address);
    const impersonatorBalDai = await DaiToken.balanceOf(impersonatedSigner.address);
    const impersonatorBalUsdc = await UsdcToken.balanceOf(impersonatedSigner.address);
    console.log(`UNI = ${impersonatorBalUni}, LINK = ${impersonatorBalLink}, DAI = ${impersonatorBalDai}, USDC = ${impersonatorBalUsdc}`);

    // end this section
    console.log(`******  we are done with here  ******`);


    // lets interact with the contracts using the interfaces.

    //Adding liquidity(UNI & LINK) to uniswap pool.
    console.log(`****** Function addLiquidity ******`);

    // first log the balance of both tokens in impersonator bal.
    //uni bal
    const UniBalBefore = impersonatorBalUni;
    console.log(`UNI balance before adding liquidity ${UniBalBefore}`);

    //link bal
    const LinkBalBefore = await LinkToken.balanceOf(impersonatedSigner.address);
    console.log(`LINK balance before adding liquidity ${LinkBalBefore}`);


    //give approval.
    await LinkToken.connect(impersonatedSigner).approve(Router, 2000);

    await UniToken.connect(impersonatedSigner).approve(Router, 2000);


    //call addLiquidity function...
    await UniSwap.connect(impersonatedSigner).addLiquidity(LINK, UNI, 1500, 1500, 0, 0, ImpersonatorAddress, 1684829211);

    //link bal after liquidity
    const LinkBalAfter = await LinkToken.balanceOf(impersonatedSigner.address);
    console.log(`LINK balance After adding liquidity ${LinkBalAfter}`);

    //uni bal after liquidity..
    const UniBalAfter = await UniToken.balanceOf(impersonatedSigner.address);
    console.log(`UNI balance After adding liquidity ${UniBalAfter}`);

    //////////////////////////////////

    // addLiquidityETH (USDC)

    // USDC bal before
    const UsdcBalBefore = await UsdcToken.balanceOf(impersonatedSigner.address);
    console.log(`Usdc balance before adding Liquidty ${UsdcBalBefore}`);

    // ETH bal before
    const ethBal = await ethers.provider.getBalance(impersonatedSigner.address);
    console.log(`ETH balance before adding liquidity ${ethBal}`);

    // creating variables for transaction amounts
    const ethAmt = ethers.utils.parseEther('1');
    const Tamt = ethers.utils.parseEther('80');

    // give approval to contract
    await UsdcToken.connect(impersonatedSigner).approve(Router, Tamt);

    // call addLiquidityETH function ...

    await UniSwap.connect(impersonatedSigner).addLiquidityETH(USDC, Tamt, 0, 0, ImpersonatorAddress, 1684829211, { value: ethAmt });

    // USDC bal After
    const UsdcBalAfter = await UsdcToken.balanceOf(impersonatedSigner.address);
    console.log(`USDC balance after adding liquidity ${UsdcBalAfter}`);

    // ETH bal After
    const ethBalAfter = await ethers.provider.getBalance(impersonatedSigner.address);
    console.log(`ETH balance after adding liquidity ${ethBalAfter}`);

    ////////////////////////////////////
    //Remove Liquidity Section/////////
    //////////////////////////////////

    // first step to get liquidity pair address using uniSwap factory contract.
    const liquidityTokenAddress = await factoryContract.getPair(LINK, UNI);

    //Use existing ERC20 token(iLiquidityToken) interface to get address, give approval for token to be spent by router and also get balance of liquidity token.
    const pair = await ethers.getContractAt("iLiquidityToken", liquidityTokenAddress);

    //get address from above interface call
    const liquidityPairAddress = pair.address;
    console.log(`Liquidity pair address is ${liquidityPairAddress}`);

    // get bal of liquidity token from previously staked tokens
    const LtokenBalB4 = await pair.balanceOf(impersonatedSigner.address);
    console.log(LtokenBalB4);

    // create tx variables.
    // const _amount = await ethers.utils.parseEther("1000");
    const _ethAmount = await ethers.utils.parseEther('2');
    const _time = 1684829211;


    // give approval to uniswap to withdraw your liquidity
    await pair.connect(impersonatedSigner).approve(Router, 1000);
    console.log(`done0`);


    // call f(x)
    await UniSwap.connect(impersonatedSigner).removeLiquidity(LINK, UNI, 1000, 0, 0, impersonatedSigner.address, _time);
    console.log(`done1`);

    // Liquiduty token After
    const LtokenBalAfter = await pair.balanceOf(impersonatedSigner.address);
    console.log(`Liquidity Token after withdrawing from Balance ${LtokenBalAfter}`);
    console.log(`done2`);





















}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});