/* eslint-disable prettier/prettier */

import { TokenData } from './token-data';

export type SniperStatus = 'offline' | 'pending' | 'error';
export interface SniperForm {
  token: TokenData | null;
  buyAmountInEth: number;
  slippage: number;
  wallets: string[] | null;
  status: SniperStatus;
}
