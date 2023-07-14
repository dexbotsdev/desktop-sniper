/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import express from 'express';
import { logger } from '../sockets/logger';
import {
  listenForERC20Transactions,
  removeERC20TransactionEventListener,
} from '../contracts/erc20';
import { SnipeTransactionDto } from '../models/erc20';


export const createSniperInstance = async (req: express.Request, res: express.Response) => {
  const data: SnipeTransactionDto = req.body;
  listenForERC20Transactions(req.body);
  res.status(200).send(data);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const removeSniperInstance = async (req: express.Request, res: express.Response) => {
  removeERC20TransactionEventListener();
  logger.log({ level: 'info', message: `Holy fak, dev selling.. abort abort!` });
  res.sendStatus(200);
};
