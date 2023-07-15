/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect, useState } from 'react';
import { ClientWallet } from 'renderer/+main/models/client-wallet';

export const useGetSniperWallets = () => {
  const [wallets, setWallets] = useState<ClientWallet[] | undefined>();
  const getWallets = useCallback(async () => {
    fetch('http://localhost:8000/api/wallet', { method: 'GET' })
      .then(async (data) => {
        const value = await data.json();
        setWallets(value);
      return null
    })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    getWallets();
  }, [getWallets]);
  return { wallets };
};
