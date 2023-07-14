/* eslint-disable prettier/prettier */
/* eslint-disable no-console */

import { useCallback, useEffect, useState } from 'react';
import { SniperForm } from '../models';
import useSniperStatusSocket from './sniper-status';

export default function useSniperForm() {
  const { status } = useSniperStatusSocket();
  const [form, setForm] = useState<SniperForm>({
    buyAmountInEth: 0,
    token: null,
    slippage: 80,
    wallets: null,
    status,
  });

  const updateForm = useCallback((_form: Partial<SniperForm>) => {
    setForm((prev) => ({ ...prev, ..._form }));
  }, []);

  useEffect(() => {
    updateForm({ status });
  }, [status, updateForm]);

  const submitForm = useCallback(async (_form: SniperForm) => {
    fetch(`http://localhost:8000/api/sniper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(_form),
    }).catch((err) => console.log(err));
  }, []);

  const abort = useCallback(() => {
    fetch(`http://localhost:8000/api/sniper`, {
      method: 'DELETE',
    }).catch((err) => console.log(err));
  }, []);

  return { form, updateForm, submitForm, abort };
}
