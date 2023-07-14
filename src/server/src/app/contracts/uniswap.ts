/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */

import { BigNumber, ethers } from 'ethers';
import {
  PairProviders,
  accounts,
  pair_providers,
  tokenBlacklist,
} from '../../constants';
import { uniswapFactory } from '../../constants/contracts';
import { TokenData } from '../models/token-data';

const io = require('socket.io-client');

const uniswap_pairs: { [id: string]: TokenData } = {};
const contract = uniswapFactory(accounts[0]);

// Function to send a message to the WebSocket server
function sendMessageToWebSocketServer(message: string) {
  const socket = io(process.env.WSS_URL); // WebSocket server URL
  socket.emit('transaction', message);
}

export function listenToUniswapLivePairs() {
  const filter = contract.filters.PairCreated();
  contract.on(
    filter,
    async (
      token0: PairProviders,
      token1: PairProviders,
      pairAddress: string,
      bigNumber: BigNumber
    ) => {
      const liquidity = ethers.utils.formatEther(bigNumber);
      const deployed_address = tokenBlacklist.some((addy) => token0 === addy)
        ? token1
        : token0;
      const pair_address: PairProviders = tokenBlacklist.some(
        (addy) => token0 === addy
      )
        ? token0
        : token1;
      const data = {
        token0,
        token1,
        pairAddress,
        liquidity,
        deployed_address,
        pair: pair_providers[pair_address],
      };
      uniswap_pairs[deployed_address] = data;
      sendMessageToWebSocketServer(JSON.stringify(uniswap_pairs));
    }
  );
}

export function removeUniswapEventListeners() {
  contract.removeAllListeners();
}
