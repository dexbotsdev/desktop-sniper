/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { ChangeEvent, useCallback } from 'react';
import { SniperForm } from './models';

interface SnipeDetailProps {
  form: SniperForm;
  onUpdateForm: (value: Partial<SniperForm>) => void;
  onSubmitForm: (form: SniperForm) => void;
}
export default function SnipeDetailComponent({
  form,
  onUpdateForm,
  onSubmitForm,
}: SnipeDetailProps) {
  const updateForm = useCallback(
    (value: string, key: 'slippage' | 'buyAmount') => {
      const number = Number(value);
      switch (key) {
        case 'buyAmount':
          onUpdateForm({ buyAmountInEth: number });
          break;
        case 'slippage':
          onUpdateForm({ slippage: number });
          break;
        default:
      }
    },
    [onUpdateForm]
  );
  const submit = useCallback(
    (_form: SniperForm) => {
      onSubmitForm(_form);
    },
    [onSubmitForm]
  );
  return (
    <div className="flex-1 flex flex-col p-2 gap-2">
      <span className="w-full">
        <h2 className="text-lg font-semibold font-mono">Details</h2>
        <p className="text-md font-semibold">
          Pair address: {form.token?.pairAddress}
        </p>
        <p className="text-md font-semibold">
          Deployer address: {form.token?.deployed_address}
        </p>
      </span>
      <span className="inline-flex flex-col p-2 gap-2">
        <label htmlFor="amount">Buy Amount</label>
        <input
          id="amount"
          className="w-full py-3 px-3 rounded"
          value={form.buyAmountInEth}
          type="number"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            updateForm(event.target.value, 'buyAmount')
          }
        />
        <label htmlFor="slippage">Slippage</label>
        <input
          id="slippage"
          className="w-full py-3 px-3 rounded"
          value={form.buyAmountInEth}
          type="number"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            updateForm(event.target.value, 'slippage')
          }
        />
      </span>
      <span className="flex flex-col w-full p-2 gap-2">
        <button
          onClick={() => submit(form)}
          type="button"
          className="py-3 rounded bg-lime-400 shadow-sm shadow-[rgba(0,0,0,0.2)]"
        >
          <p className="font-semibold">Snipe</p>
        </button>
      </span>
    </div>
  );
}
