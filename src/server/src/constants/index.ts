/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import {
  Wallet,
  ethers,
  providers,
  // providers
} from 'ethers';

export const PAN_ROUTER_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
export const WBNB_CONTRACT = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
export const UNI_WOUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
export const WETH_CONTRACT = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

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

/**
 *
 *  Buy amount in ethereum - Only need to set if MATCH_MOST_RECENT_BUY_AMOUNT = false
 *
 * */
export const BUY_AMOUNT: number = 0.02;

export const SLIPPAGE_ON_SELL: number = 40;
export const SLIPPAGE_ON_BUY: number = 40;

// This is just configuration, no need to change
export const customWsProvider: providers.WebSocketProvider =
  new ethers.providers.WebSocketProvider(process.env.WSS!, {
    name: 'ethereum',
    chainId: 1,
  });

/**
 *  create extra accounts here
 *
 *  @example export const accountThree: Ethers.wallet = new ethers.Wallet(process.env.SECRET_THREE!).connect(customWsProvider)
 *
 * */
export const accountOne: Wallet = new ethers.Wallet(
  process.env.SECRET_ONE!
).connect(customWsProvider);
export const accountTwo: Wallet = new ethers.Wallet(
  process.env.SECRET_TWO!
).connect(customWsProvider);
export const accountThree: Wallet = new ethers.Wallet(
  process.env.SECRET_THREE!
).connect(customWsProvider);
export const accountFour: Wallet = new ethers.Wallet(
  process.env.SECRET_FOUR!
).connect(customWsProvider);
export const accounts: Array<Wallet> = [accountOne];

/**
 *
 *  enter the contract addresses of the redirect accounts here
 *
 */
export const REDIRECT_TOKENS_ACCOUNT: string | null =
  '0xf697AB7690E51Bf0717e5312d31e080f1A247798';

/**
 *
 * If set to true will generate ABI from contract address;
 * This feature will decrease performance which may lead to undesired behaivours.
 *
 */
export const USE_DYNAMIC_ABI: boolean = true;

/**
 *
 *  If set to true will ignore honeypot scanner
 *  !! Only set to true if you are willing to buy honeypot
 *  useful for sniping trusted launches where false honeypot may be possible
 *
 * */
export const IGNORE_HONEYPOT_SCAN: boolean = true;

/**
 *
 *  If set to true, will log token etherscan, dextools, pancakeswap and honeypot urls
 *
 */
export const LOG_TOKEN_URLS_ON_STARTUP: boolean = true;

/**
 *
 *  Set BUY_INTERVAL_IN_MILLISECONDS to null to buy once per address;
 *
 */
export const BUY_INTERVAL_IN_MILLISECONDS: number | null = 10;
export const MAX_AMOUNT_OF_BUYS_PER_ACCOUNT: number = 3;

/**
 *
 *  If set to true will buy at the same price as the most recent transaction
 *
 */
export const MATCH_MOST_RECENT_BUY_AMOUNT: boolean = false;

/**
 *
 *  This is experimental and most liekly does not work
 */
export const SELL_ON_RUG_PENDING: boolean = true;
