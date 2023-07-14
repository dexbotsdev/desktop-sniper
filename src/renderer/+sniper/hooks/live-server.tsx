/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { useCallback, useState } from 'react';
import useNewWebSocket from './web-socket';

export default function useLoggerWebSocket() {
  const [logs, setLogs] = useState<string[]>([]);
  const ws = useNewWebSocket('ws://localhost:8000/logger');

  if (ws) {
    ws.onmessage = (event: { data: string }) => {
      console.log(event);
      setLogs((prev) => [...prev, event.data]);
    };
    ws.onerror = (event) => {
      console.log(event);
    };
    ws.onclose = (event) => {
      console.log(event);
    };
  }
  const closeLoggerConnection = useCallback(() => {
    if (ws) {
      ws.close();
    }
  }, [ws]);
  return { logs, closeLoggerConnection };
}
