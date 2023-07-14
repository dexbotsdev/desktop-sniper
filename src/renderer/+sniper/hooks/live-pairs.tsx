/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { useCallback, useEffect, useState } from 'react';
import { TokenData } from '../models';

export const useNewWebSocket = (url: string) => {
  const [ws, setWs] = useState<WebSocket | null>();
  useEffect(() => {
    setWs(new WebSocket(url));
  }, [setWs, url]);
  return ws;
};

export const usePairsWebsocket = () => {
  const [pairs, setPairs] = useState<TokenData[]>([]);
  const ws = useNewWebSocket('wss://localhost:8000');
  if (ws) {
    ws.onmessage = (event: { data: string }) => {
      const entities = JSON.parse(event.data) as { [k: string]: TokenData };
      const items = Object.keys(entities).map((id) => entities[id]);
      setPairs(items);
    };
  }
  const closeConnection = useCallback(() => {
    if (ws) {
      ws.close();
    }
  }, [ws]);
  return { pairs, closeConnection };
};
