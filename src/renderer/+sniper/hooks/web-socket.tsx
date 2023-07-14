/* eslint-disable prettier/prettier */

import { useEffect, useState } from 'react';

export default function useNewWebSocket(url: string) {
  const [ws, setWs] = useState<WebSocket | null>();
  useEffect(() => {
    setWs(new WebSocket(url));
  }, [setWs, url]);
  return ws;
}
