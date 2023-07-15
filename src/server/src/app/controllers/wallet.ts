/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable lines-between-class-members */

import express from 'express';
import { BigNumber, Wallet, ethers } from 'ethers';
import { customWsProvider, mainAccount } from '../../constants';
import { BuyTokenDto } from '../models/erc20';
import sendMultiWalletContractTransaction from '../contracts/multisend';

export class ClientWallet {
  public address: string | null;
  public balance: Promise<BigNumber> | null;
  public receiver: string | null;
  public name?: string;
  constructor(wallet: Wallet, receiver: string, name?: string){
    this.address = wallet.address;
    this.balance = null;
    this.receiver = receiver;
    this.name = name;
    this.balance = wallet.provider.getBalance(wallet.address);
  }

  async getClientValues(){
    if(this.balance){
      const balance = await this.balance;
      return {
        ...this,
        balance: ethers.utils.formatEther(balance)
      }
    }
    return this;
  }

}

export const constructBuyTokenDtoArray = (accounts: string[]): BuyTokenDto[] | null => {
  const array: BuyTokenDto[] = [];
  if(process.env.SECRETS){
    const secrets = process.env.SECRETS.replace('\n','').split(",").map((val) => {
      const values = val.split('|');
      if(values[0] && values[0].startsWith('#')){
        return { secret: values[1].replace('\n',''), name: values[0].replace('\n','')}
      }
      return { secret: values[0].replace('\n',''), name: values[1].replace('\n','')}
    });
    const wallets = secrets.map((secret) => (new Wallet(secret.secret).connect(customWsProvider)));
    for(let i = 0; i < wallets.length; i+=1){
      if(accounts.some(account => account === wallets[i].address)){
        array.push({buyer: wallets[i], receiver: wallets[i].address});
      }
    }
    return array;
  }
    return null;
}

export const constructClientWallets = async (): Promise<{[k in string]: ClientWallet} | null> => {
  const entities: {[k in string]: ClientWallet} = {};
  if(process.env.SECRETS){
    const secrets = process.env.SECRETS.replace('\n','').split(",").map((val) => {
      const values = val.split('|');
      if(values[0] && values[0].startsWith('#')){
        return { secret: values[1].replace('\n',''), name: values[0].replace('\n','')}
      }
      return { secret: values[0].replace('\n',''), name: values[1].replace('\n','')}
    });
    const wallets = secrets.map((secret) => ({wallet: new Wallet(secret.secret).connect(customWsProvider), name: secret.name}))
    for(let i = 0; i < wallets.length; i+=1){
      const {name, wallet } = wallets[i];
      // eslint-disable-next-line no-await-in-loop
      entities[wallet.address] = await new ClientWallet(wallet, wallet.address,name).getClientValues();
    }
    return entities;
  }
    return null;
}

export const getAllWallets = async (req: express.Request, res: express.Response) => {
  try{
    const wallets = await constructClientWallets();
    if(wallets){
      const array = Object.keys(wallets);
      res.status(200).send(await Promise.all(array.map(wallet => wallets[wallet])));
    } else {
      res.status(200).send([]);
    }
  } catch(err){
    console.log(err);
    res.status(500).send(err);
  }
};

export const getMainWallet = async (req: express.Request, res: express.Response) => {
  res.status(200).send(await new ClientWallet(mainAccount, mainAccount.address).getClientValues());
} 

export const sendMultiWalletTransaction = async (req: express.Request, res: express.Response) => {
  const { body } = req as { body: { wallets:string[]; amount: string } };
  const transaction = await sendMultiWalletContractTransaction(mainAccount,body.wallets,body.amount)
  res.status(200).send(JSON.stringify(transaction));
}

export const updateWallets = () => {};

