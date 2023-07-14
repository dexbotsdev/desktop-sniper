/* eslint-disable prettier/prettier */
import express from 'express';
import { accounts, mainAccount } from '../../constants';

export const getAllWallets = async (req: express.Request, res: express.Response) => {
  res.status(200).send(Object.keys(accounts));
};

export const getMainWallet = async (req: express.Request, res: express.Response) => {
  res.status(200).send({address: mainAccount.address});
} 

export const updateWallets = () => {};
