/* eslint-disable prettier/prettier */
/* eslint-disable no-console */

import { useCallback, useEffect, useState } from 'react';
import { SniperForm } from '../models';
import useSniperStatusSocket from './sniper-status';

export const defaultForm: SniperForm = {
  transaction: {
    _address: null,
    _gasPrice: 0,
    _buyPercentage: 0,
    _gasLimit: 0,
    _accounts: [],
    _slippage: 0,
  },
  status: 'offline',
}

export default function useSniperForm() {
  const { status } = useSniperStatusSocket();
  const [form, setForm] = useState<SniperForm>(defaultForm);

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
      body: JSON.stringify(_form.transaction),
    }).catch((err) => console.log(err));
  }, []);

  const abort = useCallback(() => {
    fetch(`http://localhost:8000/api/sniper`, {
      method: 'DELETE',
    }).catch((err) => console.log(err));
  }, []);

  return { form, updateForm, submitForm, abort };
}
