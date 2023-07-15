/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import express from 'express';
import { logger } from '../sockets/logger';
import {
  getERC20SniperTransactions,
  listenForERC20Transactions,
  removeERC20TransactionEventListener,
} from '../contracts/erc20';
import { SnipeTransactionDto } from '../models/erc20';

export const getSniperTransactions = async (req: express.Request, res: express.Response) => {
  try{
    const transactions = getERC20SniperTransactions()
    res.status(200).send(transactions);
  } catch(err){
    console.log(err);
    res.status(500).send(err);
  }
}

export const createSniperInstance = async (req: express.Request, res: express.Response) => {
  const data: SnipeTransactionDto = req.body;
  try{
    await listenForERC20Transactions(data);
    res.status(200).send(data);
  } catch(err){
    console.log(err);
    logger.log({ level: 'info', message: JSON.stringify(err) });
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const removeSniperInstance = async (req: express.Request, res: express.Response) => {
  removeERC20TransactionEventListener();
  logger.log({ level: 'info', message: `Holy fak, dev selling.. abort abort!` });
  res.sendStatus(200);
};
