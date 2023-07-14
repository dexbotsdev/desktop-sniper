/* eslint-disable prettier/prettier */
import { TokenData } from './token-data';

export interface CreateSnipeInstanceRequest {
  token: TokenData | null;
  buyAmountInEth: number;
  slippage: number;
}
