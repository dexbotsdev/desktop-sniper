/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */

import { BigNumber, Contract, ethers } from 'ethers';
import {
  PairProviders,
  mainAccount,
  pair_providers,
  tokenBlacklist,
} from '../../constants';
import { uniswapFactory } from '../../constants/contracts';
import { TokenData } from '../models/token-data';
import { sendUniswapWSSMessage } from '../sockets/uniswap';

const uniswap_pairs: { [id: string]: TokenData } = {};
let contract: Contract | null;
let filter: any = null;
let livePairsListener: any = null;

export function listenToUniswapLivePairs() {
  contract = uniswapFactory(mainAccount)
  filter = contract.filters.PairCreated();
  livePairsListener = contract.on(filter, async ( token0: PairProviders, token1: PairProviders, pairAddress: string, bigNumber: BigNumber ) => {
      const liquidity = ethers.utils.formatEther(bigNumber);
      const deployed_address = tokenBlacklist.some((addy) => token0 === addy) ? token1 : token0;
      const pair_address: PairProviders = tokenBlacklist.some((addy) => token0 === addy) ? token0 : token1;
      const data = { token0, token1, pairAddress, liquidity, deployed_address, pair: pair_providers[pair_address] };
      uniswap_pairs[deployed_address] = data;
      sendUniswapWSSMessage(JSON.stringify(uniswap_pairs));
    }
  );
}

export function removeUniswapEventListeners() {
  if(contract){
    contract.removeListener(filter, livePairsListener);
    contract = null;
  }
}
