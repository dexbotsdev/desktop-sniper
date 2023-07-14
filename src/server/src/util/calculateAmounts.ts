/* eslint-disable prettier/prettier */
import * as Ethers from 'ethers'
import { BUY_AMOUNT, MATCH_MOST_RECENT_BUY_AMOUNT, SLIPPAGE_ON_BUY, SLIPPAGE_ON_SELL, UNI_WOUTER, WETH_CONTRACT } from "../constants";
import erc20, { router } from "../constants/contracts";

const ethers = require('ethers');

export default async function calculateAmounts(account: Ethers.Wallet, contractAddress: string, txnType: 'SELL' | 'BUY', recentBuyAmount?: Ethers.BigNumber):
    Promise<{ amountIn: Ethers.BigNumber, amountOutMin: Ethers.BigNumber }> {
    const amountIn = recentBuyAmount ?? ethers.utils.parseEther(BUY_AMOUNT.toString());
    const amounts = await router(account).getAmountsOut(amountIn, [WETH_CONTRACT, contractAddress]);
    const amountOutMin = amounts[1].sub(amounts[1].div(100).mul(txnType === 'BUY' ? SLIPPAGE_ON_BUY : SLIPPAGE_ON_SELL));
    return { amountIn, amountOutMin }
}

export async function calculateSellAmounts(tokenContract: string, account: Ethers.Wallet):
    Promise<{ amountIn: Ethers.BigNumber, amounts: Ethers.BigNumber, amountOutMin: Ethers.BigNumber }> {
    const accountAddress = account.address
    const tokenBalance = await erc20(account, tokenContract).balanceOf(accountAddress);

    const amountIn = tokenBalance.mul(99).div(100)
    const amounts = await router(account).getAmountsOut(amountIn, [WETH_CONTRACT, tokenContract]);
    const amountOutMin = amounts[1].sub(amounts[1].div(100).mul(SLIPPAGE_ON_SELL));

    return { amountIn, amounts, amountOutMin }
}