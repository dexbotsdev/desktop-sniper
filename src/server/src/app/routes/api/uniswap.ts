/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import express from 'express';
import {
  listenToUniswapLivePairs,
  removeUniswapEventListeners,
} from '../../contracts/uniswap';
import { logger } from '../../sockets/logger';

const router = express.Router();

router.post('/live-pairs', () => {
  listenToUniswapLivePairs();
  logger.log({ level: 'info', message: 'Uniswap Live Pairs Connected!' });
});

router.delete('/live-pairs', () => {
  removeUniswapEventListeners();
  logger.log({ level: 'info', message: 'Uniswap Live Pairs Disconnected!' });
});

export default router;
