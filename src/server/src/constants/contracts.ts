/* eslint-disable prettier/prettier */

import { Wallet, ethers } from 'ethers';
import { erc20Abi, factoryAbi, pairAbi, multisendAbi, routerAbi } from './abis';

export const UNISWAP_ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
export const WETH_CONTRACT = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
export const UNISWAP_FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
export const MULTISEND_CONTRACT = "0xCD5485b34c9902527bbEE21F69312fe2A73bc802"

export default function erc20Contract(account: Wallet, tokenAddress: string) {
  return new ethers.Contract(tokenAddress, erc20Abi, account);
}

export function router(account: Wallet) {
  return new ethers.Contract(UNISWAP_ROUTER, routerAbi, account);
}

export function uniswapFactory(account: Wallet) {
  return new ethers.Contract(UNISWAP_FACTORY, factoryAbi, account);
}

export function pair(account: Wallet, address: string) {
  return new ethers.Contract(address, pairAbi, account);
}

export function multiSend(account: Wallet){
  return new ethers.Contract(MULTISEND_CONTRACT, multisendAbi, account)
}