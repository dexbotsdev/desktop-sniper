/* eslint-disable prettier/prettier */
import internal from 'stream';
import http from 'http';
import uniswapWss from './uniswap';
import loggerWss from './logger';
import sniperStatus from './sniper-status';

type WebsocketPaths = '/uniswap' | '/logger' | '/sniper-status';

export default function handleWebsocketRequests(
  request: http.IncomingMessage,
  socket: internal.Duplex,
  head: Buffer
) {
  // Extract the path from the request URL
  if (!request.url) {
    return;
  }
  const { pathname } = new URL(request.url, 'http://localhost') as {
    pathname: WebsocketPaths;
  };

  if (pathname) {
    switch (pathname) {
      case '/uniswap':
        uniswapWss.handleUpgrade(request, socket, head, (ws) => {
          uniswapWss.emit('connection', ws, request);
        });
        break;
      case '/logger':
        loggerWss.handleUpgrade(request, socket, head, (ws) => {
          loggerWss.emit('connection', ws, request);
        });
        break;
      case '/sniper-status':
        sniperStatus.handleUpgrade(request, socket, head, (ws) => {
          sniperStatus.emit('connection', ws, request);
        });
        break;
      default:
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
        socket.destroy();
    }
  }
}
