/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { useCallback, useState } from 'react';
import useNewWebSocket from './web-socket';
import { SniperStatus } from '../models';

export const useAbortSniperProcess = () => {
  return useCallback(() => {
    fetch(`http://localhost:8000/api/sniper`, {
      method: 'DELETE',
    }).catch((err) => console.log(err));
  }, []);
};

export default function useSniperStatusSocket() {
  const [status, setStatus] = useState<SniperStatus>('offline');
  const ws = useNewWebSocket('ws://localhost:8000/sniper-status');
  const abort = useAbortSniperProcess();
  if (ws) {
    ws.onmessage = (event: { data: SniperStatus }) => {
      console.log(event.data);
      setStatus(event.data);
    };
    ws.onerror = (event) => {
      console.log(event);
    };
    ws.onclose = (event) => {
      console.log(event);
      abort();
    };
  }
  const closeSniperStatusConnection = useCallback(() => {
    if (ws) {
      ws.close();
    }
  }, [ws]);
  return { status, closeSniperStatusConnection };
}
