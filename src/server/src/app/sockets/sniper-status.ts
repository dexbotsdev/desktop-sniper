/* eslint-disable prettier/prettier */
/* eslint-disable no-console */

import WS, { WebSocket } from 'ws';

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
  if (client && client.readyState === WebSocket.OPEN) {
    client.send('offline');
  }
});

// Function to send a message to the WebSocket server
export function sendSniperStatusMessage(message: string) {
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(message);
  }
}

export const removeSniperStatusWSSConnection = () => {
  client?.close();
};

export default wss;
