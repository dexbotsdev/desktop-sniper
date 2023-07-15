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
    const buyOrder = await generateBuyOrderFromSnipeTransaction(props, contract);
    if(contract){
    sendSniperStatusMessage('pending');
    logger.log({ level: 'info', message: `Pending snipe on ${await contract.name()}` });

    transactionListener = contract.on('Transfer', async () => {
      if(!snipeInProgress){
        snipeInProgress = true;
        logger.log({ level: 'info', message: `Sending buy orders` });
        if(buyOrder){
          const result = await buyTokensRecursive(buyOrder, 0, []);
          if(result){
            const results = await Promise.all(result).catch(err => err);
            logger.log({ level: 'info', message: `RESULT ${JSON.stringify(await results)}` });
          } else {
            logger.log({ level: 'info', message: `RESULT ${result}` });
          }
        }
        logger.log({ level: 'info', message: `Unkown error occured` });
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
  contract?.off('Transfer', transactionListener);
  sendSniperStatusMessage('offline');
};