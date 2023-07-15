/* eslint-disable prettier/prettier */

import { SnipeTransactionDto } from './transaction';

export type SniperStatus = 'offline' | 'pending' | 'error';
export interface SniperForm {
  transaction: SnipeTransactionDto;
  status: SniperStatus;
}
