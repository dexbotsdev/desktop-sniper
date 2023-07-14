/* eslint-disable prettier/prettier */
import { TokenData } from './token-data';

export interface CreateSnipeInstanceRequest {
  token: TokenData | null;
  buyAmountInEth: number;
  slippage: number;
}


export interface CreateSniperInstanceDto { 
  token: TokenData;
  slippage: number;
  wallets: string[] | null;
  buyAmountInEth: number
}
