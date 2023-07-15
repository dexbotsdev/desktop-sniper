/* eslint-disable prettier/prettier */
/* eslint-disable no-console */

import { useCallback, useEffect, useState } from "react";
import { ClientWallet } from "renderer/+main/models/client-wallet";

export default function useGetMainWallet(){
    const [wallet, setWallet] = useState<ClientWallet | undefined>({address: null, balance: null, receiver: null, name: null});
    const getWallet = useCallback(async () => {
        fetch('http://localhost:8000/api/wallet?main=true', { method: 'GET' })
        .then(async (data) => {
            const value = await data.json();
             return setWallet(value)})
        .catch((err) => console.log(err));
    }, []);
    useEffect(() => {
        getWallet();
    }, [getWallet]);
    return { wallet };
}