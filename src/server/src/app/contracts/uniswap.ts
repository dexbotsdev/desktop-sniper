/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */

import { BigNumber, Contract, ethers } from 'ethers';
import {
  PairProviders,
  mainAccount,
  pair_providers,
  tokenBlacklist,
} from '../../constants';
import erc20Contract, { uniswapFactory } from '../../constants/contracts';
import { TokenData } from '../models/token-data';
import { sendUniswapWSSMessage } from '../sockets/uniswap';

const uniswap_pairs: { [id: string]: TokenData } = {};
let uniswapContract: Contract | null;
let filter: any = null;
let livePairsListener: any = null;

export function listenToUniswapLivePairs() {
  uniswapContract = uniswapFactory(mainAccount)
  filter = uniswapContract.filters.PairCreated();
  livePairsListener = uniswapContract.on(filter, async ( token0: PairProviders, token1: PairProviders, pairAddress: string, bigNumber: BigNumber ) => {
    const liquidity = ethers.utils.formatEther(bigNumber);
    const deployed_address = tokenBlacklist.some((addy) => token0 === addy) ? token1 : token0;
    const contract = erc20Contract(mainAccount,deployed_address);
    const name = await contract.name();
      const pair_address: PairProviders = tokenBlacklist.some((addy) => token0 === addy) ? token0 : token1;
      const data = { token0, token1, pairAddress, liquidity, deployed_address, pair: pair_providers[pair_address], name };
      uniswap_pairs[deployed_address] = data;
      sendUniswapWSSMessage(JSON.stringify(uniswap_pairs));
    }
  );
}

export function removeUniswapEventListeners() {
  if(uniswapContract){
    uniswapContract.removeListener(filter, livePairsListener);
    uniswapContract = null;
  }
}
