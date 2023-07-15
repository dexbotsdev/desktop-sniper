/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */

import { useCallback, useEffect, useState } from 'react';
import { SniperForm } from '../models';
import useSniperStatusSocket from './sniper-status';

export const defaultForm: SniperForm = {
  transaction: {
    _address: null,
    _gasPrice: null,
    _buyPercentage: null,
    _gasLimit: null,
    _accounts: null,
    _slippage: null,
  },
  status: 'offline',
}

export default function useSniperForm() {
  const { status } = useSniperStatusSocket();
  const [form, setForm] = useState<SniperForm>(defaultForm);
  const [formState, setFormState] = useState<'invalid' | 'valid'>();

  const validateFormChanges = useCallback((_form: SniperForm) => {
    if(!_form.transaction._address ||
      !_form.transaction._accounts ||
      !_form.transaction._buyPercentage ||
      !_form.transaction._gasLimit || 
      !_form.transaction._slippage ||
      _form.transaction._accounts.length === 0
    ){ 
    setFormState('invalid');
    } else {
      setFormState('valid');
    };
  }, [])

  useEffect(() => {
    validateFormChanges(form);
  }, [form, validateFormChanges]);

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

  return { form, updateForm, submitForm, abort, formState };
}
