/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

import { Contract } from 'ethers';
import erc20Contract from '../../constants/contracts';
import { mainAccount } from '../../constants';
import { sendSniperStatusMessage } from '../sockets/sniper-status';
import { buyTokensRecursive, generateBuyOrderFromSnipeTransaction } from './util/erc20';
import { BuyTokenDto, SnipeTransactionDto } from '../models/erc20';
import { logger } from '../sockets/logger';
import { ClientWallet } from '../controllers/wallet';

let contract: Contract | null = null;
let transactionListener: any;
let snipeInProgress: boolean = false;
let snipeTransactions: { tx: null; account: BuyTokenDto }[] = [];

export const listenForERC20Transactions = async (props: SnipeTransactionDto) => {
    contract = erc20Contract(mainAccount, props._address);
    if(contract){
    sendSniperStatusMessage('pending');
    logger.log({ level: 'info', message: `Pending snipe on ${await contract.name()}` });
    transactionListener = contract.on('Transfer', async () => {
      if(snipeInProgress){
        return;
      }
      snipeInProgress = true;
      if(contract){
        logger.log({ level: 'info', message: `Sending buy orders` });
        const buyOrder = await generateBuyOrderFromSnipeTransaction(props, contract);
        if(buyOrder){
          const result = await buyTokensRecursive(buyOrder, 0, []);
          if(result){
            const results = await Promise.all(result).catch(err => err);
            console.log("RESULT", await results);
          } else {
            console.log("RESULT", result);
          }
        }
      }
    });
  }
};

export const getERC20SniperTransactions = (): {tx: any, account: ClientWallet}[] => {
   const transactions = snipeTransactions.map(value => {
     return {...value, account: new ClientWallet(value.account.buyer, value.account.receiver)}
    })
    snipeTransactions = [];
  return transactions;
}

export const removeERC20TransactionEventListener = () => {
  contract?.removeListener('Transfer', transactionListener);
  contract = null;
  sendSniperStatusMessage('offline');
};