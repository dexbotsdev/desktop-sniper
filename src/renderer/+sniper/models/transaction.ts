/* eslint-disable prettier/prettier */

export interface SnipeTransactionDto {
    _address: string | null;
    _gasPrice: number;
    _buyPercentage: number;
    _gasLimit: number;
    _accounts: string[];
    _slippage: number;
  }