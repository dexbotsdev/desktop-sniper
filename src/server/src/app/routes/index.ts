/* eslint-disable prettier/prettier */
import express from 'express';
import dotenv from 'dotenv';

import sniper from './api/sniper';
import uniswap from './api/uniswap';
import wallet from './api/wallet';

dotenv.config();

const router = express.Router();

router.use('/sniper', sniper);
router.use('/uniswap', uniswap);
router.use('/wallet', wallet);

export default router;
