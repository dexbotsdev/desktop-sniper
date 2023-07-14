/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-console */
import WS, { WebSocket } from 'ws';
import winston from 'winston';
import Transport from 'winston-transport';

const wss = new WS.Server({ noServer: true });
let client: WebSocket | null = null;
wss.on('connection', (ws: any) => {
  client = ws;
  console.log('WebSocket connection established');
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
  ws.on('error', (error: unknown) => {
    console.log(error);
  });
});

export const sendLoggerWSSMessage = (message: string) => {
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(message);
  }
};

export const removeLoggerWSSConnection = () => {
  client?.close();
};

class WebSocketTransport extends Transport {
  constructor(options?: any) {
    super(options);
  }

  log(info: any, callback: any) {
    setImmediate(() => {
      this.emit('logged', info);
    });
    console.log(info.message);
    sendLoggerWSSMessage(info.message);
    callback();
  }
}

export const logger = winston.createLogger({
  transports: [new WebSocketTransport()],
});

export default wss;
