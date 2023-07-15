/* eslint-disable prettier/prettier */
/* eslint-disable lines-between-class-members */

import express from 'express';
import { BigNumber, Wallet } from 'ethers';
import { customWsProvider, mainAccount } from '../../constants';
import { BuyTokenDto } from '../models/erc20';

export class ClientWallet {
  public address: string | null;
  public balance: BigNumber | null;
  public receiver: string | null;
  constructor(wallet: Wallet, receiver: string){
    this.address = wallet.address;
    this.balance = null;
    this.receiver = receiver;
    this.getBalance(wallet);
  }
  async getBalance(wallet: Wallet){
    this.balance = await wallet.getBalance();
  }
}

export const constructBuyTokenDtoArray = (accounts: string[]): BuyTokenDto[] | null => {
  const array: BuyTokenDto[] = [];
  if(process.env.SECRETS){
    const secrets = process.env.SECRETS.split(",");
    const wallets = secrets.map((secret) => new Wallet(secret.replace('\n','').replace('\n','')).connect(customWsProvider))
    for(let i = 0; i < wallets.length; i+=1){
      if(accounts.some(account => account === wallets[i].address)){
        array.push({buyer: wallets[i], receiver: wallets[i].address});
      }
    }
    return array;
  }
    return null;
}

export const constructClientWallets = (): {[k in string]: ClientWallet} | null => {
  const entities: {[k in string]: ClientWallet} = {};
  if(process.env.SECRETS){
    const secrets = process.env.SECRETS.split(",");
    const wallets = secrets.map((secret) => new Wallet(secret.replace('\n','').replace('\n','')).connect(customWsProvider))
    for(let i = 0; i < wallets.length; i+=1){
      entities[wallets[i].address] = new ClientWallet(wallets[i], wallets[i].address);
    }
    return entities;
  }
    return null;
}

export const getAllWallets = async (req: express.Request, res: express.Response) => {
  const wallets = constructClientWallets();
  if(wallets){
    res.status(200).send(Object.keys(wallets));
  } else {
    res.status(200).send([]);
  }
};

export const getMainWallet = async (req: express.Request, res: express.Response) => {
  res.status(200).send(new ClientWallet(mainAccount, mainAccount.address));
} 

export const updateWallets = () => {};

