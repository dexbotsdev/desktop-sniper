/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import WS, { WebSocket } from 'ws';

const wss = new WS.Server({ noServer: true });
let client: WebSocket | null = null;

wss.on('connection', (ws: any) => {
  console.log('WebSocket connection established');
  client = ws;
  ws.on('close', () => {
    console.log('WebSocket connection closed');
    client = null;
  });
  ws.on('message', (message: string) => {
    if (message.startsWith('transaction:') && client) {
      client.send(message);
    }
  });
});

export default wss;
