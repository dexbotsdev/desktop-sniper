/* eslint-disable prettier/prettier */
/* eslint-disable no-console */

import { useCallback, useState } from 'react';
import { SniperForm } from '../models';

export default function useSniperForm() {
  const [form, setForm] = useState<SniperForm>({
    buyAmountInEth: 0,
    token: null,
    slippage: 80,
  });

  const submitForm = useCallback(async (_form: SniperForm) => {
    fetch(`http://localhost:3880/api/sniper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(_form),
    })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }, []);

  const updateForm = useCallback((_form: Partial<SniperForm>) => {
    setForm((prev) => ({ ...prev, ..._form }));
  }, []);

  return { form, updateForm, submitForm };
}
