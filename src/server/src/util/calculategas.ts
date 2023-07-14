/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */

import * as Ethers from 'ethers';


export default function calculate_gas_price(action: 'buy' | 'sell', amount: Ethers.BigNumber, count: number) {
    if (action === "buy") {
        return Ethers.utils.parseUnits(amount.add(2).add(count).toString(), 'wei')
    }
    return Ethers.utils.parseUnits(amount.sub(2).add(count).toString(), 'wei')
}

export async function computeBuyOrderFromTransaction(provider: any, txHash: Ethers.Transaction | undefined, count: number, txn?: any): Promise<{
    gasLimit: Ethers.BigNumber, buyGasPrice: Ethers.BigNumber, sellGasPrice: Ethers.BigNumber, buyPrice: Ethers.BigNumber
}> {
    const transaction = txn || await provider.getTransaction(txHash);
    const gasLimit = Ethers.utils.parseUnits(transaction.gasLimit.toString(), 'wei');
    const buyGasPrice = calculate_gas_price("buy", transaction.gasPrice, count);
    const sellGasPrice = calculate_gas_price("sell", transaction.gasPrice, count);
    const buyPrice = Ethers.utils.parseUnits(transaction.value.toString(), 'wei');
    return { buyGasPrice, gasLimit, sellGasPrice, buyPrice }
}
