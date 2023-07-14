/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import express from 'express';
import {
  listenToUniswapLivePairs,
  removeUniswapEventListeners,
} from '../../contracts/uniswap';

const router = express.Router();

router.post('/live-pairs', () => {
  listenToUniswapLivePairs();
});

router.delete('/live-pairs', () => {
  removeUniswapEventListeners();
});
