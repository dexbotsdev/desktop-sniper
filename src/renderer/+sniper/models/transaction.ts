/* eslint-disable prettier/prettier */

export interface SnipeTransactionDto {
    _address: string | null;
    _gasPrice: number | null;
    _buyPercentage: number | null;
    _gasLimit: number | null;
    _accounts: string[] | null;
    _slippage: number | null;
  }