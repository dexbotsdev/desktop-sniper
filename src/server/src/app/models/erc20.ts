/* eslint-disable prettier/prettier */

import { Wallet, Contract, ethers, BigNumber } from 'ethers';

export interface CalculateTokenAmountProps {
  account: Wallet;
  tokenAmount: BigNumber;
  _contract: Contract;
  slippage: number;
}

export interface BuyTokenDto {
  buyer: Wallet;
  receiver: string;
}

export interface SnipeTransactionDto {
  _address: string;
  _gasPrice: BigNumber;
  _buyPercentage: number;
  _gasLimit: BigNumber;
  _accounts: string[];
  _slippage: number;
}

interface BaseBuyProps {
  contractAddress: string;
  gasLimit: ethers.BigNumber;
  gasPrice: ethers.BigNumber;
  amountIn: ethers.BigNumber;
  amountOut: ethers.BigNumber;
}

export interface BuyTokenRecursiveProps extends BaseBuyProps {
  accounts: BuyTokenDto[];
}

export interface BuyTokenProps extends BaseBuyProps {
  account: BuyTokenDto;
}
