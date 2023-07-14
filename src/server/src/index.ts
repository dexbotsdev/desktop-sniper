/* eslint-disable no-console */ /* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

import http, { Server as HttpServer } from 'http';
import express from 'express';
import cors from 'cors';

import { router } from './constants/contracts';

import wss from './app/sockets/sniper';

require('dotenv').config();

const app = express();
const server: HttpServer = http.createServer(app);
const PORT = 8000;
let restartServerFlag = true;

app.use(
  cors({
    origin: '*',
  })
);
app.use('/api', router);

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

function stopServer() {
  restartServerFlag = false;
  server.close(() => {
    console.log('Server permanently closed');
  });
}

const startServer = () => {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

process.on('SIGINT', () => {
  stopServer();
  process.exit();
});

server.on('close', () => {
  if (restartServerFlag) {
    setTimeout(() => {
      startServer();
    }, 5000);
  }
});

export default server;
