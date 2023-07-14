/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import * as Ethers from 'ethers';
import { MATCH_MOST_RECENT_BUY_AMOUNT, UNI_WOUTER, WETH_CONTRACT } from "../constants";
import { swapAbi } from "../constants/abis";
import calculateAmounts, { calculateSellAmounts } from './calculateAmounts';
import Logger, { LogTransactionURL } from './logger';
import { router } from '../constants/contracts';

const ethers = require('ethers');
const colors = require('colors');

colors.enable()

export async function sellToken(
    account: Ethers.Wallet,
    tokenContract: string,
    gasLimit: Ethers.BigNumber,
    gasPrice: Ethers.BigNumber,): Promise<string | null | void> {
    try {
        const uniswap = new ethers.Contract(UNI_WOUTER, swapAbi, account);
        const { amountIn, amountOutMin } = await calculateSellAmounts(tokenContract, account);
        const approve = await uniswap.approve(tokenContract, amountIn);
        const receipt_approve = await approve.wait();
        if (receipt_approve && receipt_approve.blockNumber && receipt_approve.status === 1) {
            Logger('APPROVED');
            const swap_txn = await uniswap.swapExactTokensForETHSupportingFeeOnTransferTokens(
                amountIn, amountOutMin,
                [tokenContract, WETH_CONTRACT],
                account.address,
                (Date.now() + 1000 * 60 * 10),
                { 'gasLimit': gasLimit, 'gasPrice': gasPrice, })
            const tx = await swap_txn.wait();
            return LogTransactionURL(await tx.wait());
        }
    }
    catch (err: any) {
        console.log(err)
    }

}

export async function buyToken(
    account: Ethers.Wallet,
    tokenContract: string,
    gasLimit: Ethers.BigNumber,
    gasPrice: Ethers.BigNumber,
    buyAmount: Ethers.BigNumber,
    redirectAccount: string | null,) {

    try {
        const { amountIn, amountOutMin } = await calculateAmounts(account, tokenContract, 'BUY', MATCH_MOST_RECENT_BUY_AMOUNT ? buyAmount : undefined);
        const tx = await router(account).swapExactETHForTokensSupportingFeeOnTransferTokens(
            amountOutMin,
            [WETH_CONTRACT, tokenContract],
            redirectAccount ?? account.address,
            (Date.now() + 1000 * 60 * 10),
            { 'value': amountIn, 'gasLimit': gasLimit, 'gasPrice': gasPrice, },);
        return LogTransactionURL(await tx.wait());
    }
    catch (err: any) {
        Logger('ERROR', err.code);
        return null;
    }
}