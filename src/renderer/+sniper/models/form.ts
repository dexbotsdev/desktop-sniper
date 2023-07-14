/* eslint-disable prettier/prettier */

import { TokenData } from './token-data';

export interface SniperForm {
  token: TokenData | null;
  buyAmountInEth: number;
  slippage: number;
}
