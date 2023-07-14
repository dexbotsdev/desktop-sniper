/* eslint-disable prettier/prettier */
/* eslint-disable no-console */

import { BigNumber, Contract } from 'ethers';
import erc20Contract from '../../constants/contracts';
import { accounts, mainAccount } from '../../constants';
import { sendSniperStatusMessage } from '../sockets/sniper-status';
import erc20Utils, { buyTokensRecursive } from './util/erc20';
import { SnipeTransactionDto } from '../models/erc20';
import { logger } from '../sockets/logger';

let contract: Contract | null = null;
let transactionListener: any;

export const listenForERC20Transactions = async ({ 
  _address,
  _gasPrice,
  _gasLimit,
  _accounts,
  _buyPercentage,
  _slippage
  }: SnipeTransactionDto) => {
    contract = erc20Contract(mainAccount, _address);
    sendSniperStatusMessage('pending');
    logger.log({ level: 'info', message: `Listening to ${await contract.name().catch(() => "undefined")}!` });
    transactionListener = contract.on('Transfer', async () => {
      const { calculateBuyGas, calculateTokenAmounts, getTotalSupply } = erc20Utils();
      if(contract){
        const totalSupply = getTotalSupply(contract);
        const tokenAmount = BigNumber.from(totalSupply).div(100).mul(_buyPercentage);
        const { gasLimit, gasPrice } = calculateBuyGas({ _gasLimit, _gasPrice });
        const buyOrder = await calculateTokenAmounts({tokenAmount, account: mainAccount, _contract: contract, slippage: _slippage});
        const wallets = _accounts.map((account) => accounts[account]);
        if(buyOrder){
          buyTokensRecursive({
            contractAddress: contract.address,
            accounts: wallets,
            gasLimit,
            gasPrice,
            amountIn: buyOrder.amountIn,
            amountOut: buyOrder.amountOutMin
          },0);
        }
        }
    });
};

export const removeERC20TransactionEventListener = () => {
  contract?.removeListener('Transfer', transactionListener);
  contract = null;
  sendSniperStatusMessage('offline');
};
