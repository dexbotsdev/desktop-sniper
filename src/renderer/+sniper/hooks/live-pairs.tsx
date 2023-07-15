/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { useCallback, useState } from 'react';
import { TokenData } from '../models';
import useNewWebSocket from './web-socket';

export default function usePairsWebsocket() {
  const [pairs, setPairs] = useState<TokenData[]>([]);

  const ws = useNewWebSocket('ws://localhost:8000/uniswap');

  const closeConnection = useCallback(() => {
    if (ws) {
      ws.close();
    }
  }, [ws]);

  const openConnection = useCallback(async () => {
    await fetch('http://localhost:8000/api/uniswap/live-pairs', {
      method: 'post',
    }).catch((err: unknown) => console.log(err));
  }, []);

  const abortUniswapPairsProcess = useCallback(async () => {
    await fetch('http://localhost:8000/api/uniswap/live-pairs', {
      method: 'delete',
    }).catch((err: unknown) => console.log(err));
  }, []);

  if (ws) {
    ws.onmessage = (event: { data: string }) => {
      const entities = JSON.parse(event.data) as { [k: string]: TokenData };
      const items = Object.keys(entities).map((id) => entities[id]);
      setPairs(items);
    };
    ws.onerror = (event) => {
      console.log(event);
    };
    ws.onclose = () => {
      abortUniswapPairsProcess();
    };
  }
  return { pairs, closeConnection, openConnection };
}
