/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect, useState } from 'react';

export const useGetSniperWallets = () => {
  const [wallets, setWallets] = useState<string[] | undefined>();
  const getWallets = useCallback(async () => {
    fetch('http://localhost:8000/api/wallet', { method: 'GET' })
      .then(async (data) => setWallets(await data.json()))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    getWallets();
  }, [getWallets]);
  return { wallets };
};
