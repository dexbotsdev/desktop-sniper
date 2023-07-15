/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { BigNumber, Wallet, ethers } from "ethers";
import { multiSend } from "../../constants/contracts";

export default async function sendMultiWalletContractTransaction(account: Wallet, receivingAccounts: string[], amount: string) {
    const withoutDecimals = parseFloat(amount) * (10 ** 18)
    const ethAmountPerWallet = ethers.utils.parseUnits(withoutDecimals.toString(), 'wei').div(BigNumber.from(10).pow(18)).div(receivingAccounts.length);
    const totalEthAmount = ethers.utils.parseUnits(withoutDecimals.toString(), 'wei').div(BigNumber.from(10).pow(18));
    return multiSend(account).multiTransferEqual_L1R(
        receivingAccounts,
         ethAmountPerWallet,
        {
            value: totalEthAmount,
            nonce: null,
        }
    ).catch((err: unknown) => console.log(err));
}