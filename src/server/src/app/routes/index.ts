/* eslint-disable prettier/prettier */
import express from 'express';

const router = express.Router();

const sniper = require('./api/sniper');
const uniswap = require('./api/contract');

router.use('/sniper', sniper);
router.use('/uniswap', uniswap);

export default router;
