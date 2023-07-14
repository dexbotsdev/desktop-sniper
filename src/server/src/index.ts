/* eslint-disable no-console */ /* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

import http, { Server as HttpServer } from 'http';
import express from 'express';
import cors from 'cors';

import router from './app/routes';
import handleWebsocketRequests from './app/sockets';
import { logger, removeLoggerWSSConnection } from './app/sockets/logger';
import { removeERC20TransactionEventListener } from './app/contracts/erc20';
import { removeUniswapEventListeners } from './app/contracts/uniswap';
import { removeUniswapWSSConnection } from './app/sockets/uniswap';

require('dotenv').config();

const app = express();
const server: HttpServer = http.createServer(app);
const dev = process.env.DEV;

app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);

app.use('/api', router);

server.on('upgrade', (request, socket, head) => {
  handleWebsocketRequests(request, socket, head);
});

server.on('close', () => {
  logger.log({ level: 'info', message: 'server shutting down gracefully 😴' });
  removeERC20TransactionEventListener();
  removeUniswapEventListeners();
  removeUniswapWSSConnection();
  removeLoggerWSSConnection();
});

if (!dev) {
  server.listen(process.env.SERVER_PORT, () => {
    logger.log({ level: 'info', message: 'server started' });
    console.log(`server listening on ${process.env.SERVER_PORT}`);
  });
}

export default server;
