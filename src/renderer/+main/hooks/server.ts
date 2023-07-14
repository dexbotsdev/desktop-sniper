/* eslint-disable prettier/prettier */

import { useCallback } from 'react';

export default function useRestartDevServer() {
  return useCallback(() => {
    if (window?.electron?.ipcRenderer) {
      window.electron.ipcRenderer?.sendMessage('restart-server');
    }
  }, []);
}
