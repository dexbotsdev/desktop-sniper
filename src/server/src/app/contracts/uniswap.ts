/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */

import { BigNumber, ethers } from 'ethers';
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
const contract = uniswapFactory(mainAccount);

export function listenToUniswapLivePairs() {
  const filter = contract.filters.PairCreated();
  contract.on(filter, async ( token0: PairProviders, token1: PairProviders, pairAddress: string, bigNumber: BigNumber ) => {
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
  contract.removeAllListeners();
}
