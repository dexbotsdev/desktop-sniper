/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */

import dotenv from 'dotenv';

import {
  ethers,
  providers,
  // providers
} from 'ethers';

dotenv.config();

export const tokenBlacklist = [
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
  // Add other token contract addresses that you want to filter out here
];

export const pair_providers = {
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': 'weth',
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usdc',
};

export type PairProviders =
  | '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  | '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

// This is just configuration, no need to change
export const customWsProvider: providers.WebSocketProvider =
  new ethers.providers.WebSocketProvider(process.env.WSS!, {
    name: 'ethereum',
    chainId: 1,
});

export const mainAccount = new ethers.Wallet(process.env.MAIN!).connect(
  customWsProvider
);
