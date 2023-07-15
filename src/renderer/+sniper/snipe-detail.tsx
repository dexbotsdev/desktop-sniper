/* eslint-disable no-underscore-dangle */
/* eslint-disable no-fallthrough */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { ChangeEvent, useCallback, useEffect } from 'react';
import { SniperForm } from './models';

interface SnipeDetailProps {
  form: SniperForm;
  formState: 'invalid' | 'valid';
  wallets: string[] | undefined;
  onUpdateForm: (value: Partial<SniperForm>) => void;
  onSubmitForm: (form: SniperForm) => void;
  onAbort: () => void;
}
export default function SnipeDetailComponent({
  wallets,
  form,
  formState,
  onAbort,
  onUpdateForm,
  onSubmitForm,
}: SnipeDetailProps) {
  const updateForm = useCallback(
    (
      value: string,
      key: 'slippage' | 'buyAmount' | 'wallets' | 'contractAddress' | 'gas-limit' | 'gas-price',
      _form: SniperForm
    ) => {
      const number = Number(value);
      switch (key) {
        case 'contractAddress':
          onUpdateForm({transaction: {
            ..._form.transaction,
             _address: value
          }});
          break;
          case 'buyAmount':
            if(Number.isNaN(number)){ break; }
            onUpdateForm({transaction: {
              ..._form.transaction,
               _buyPercentage: number 
            }});
            break;
        case 'gas-limit':
          if(Number.isNaN(number)){ break; }
          onUpdateForm({transaction: {
            ..._form.transaction,
             _gasLimit: number 
          }});
          break;
          case 'gas-price':
            if(Number.isNaN(number)){ break; }
            onUpdateForm({transaction: {
              ..._form.transaction,
               _gasPrice: number 
            }});
            break;
        case 'slippage':
          if(Number.isNaN(number)){ break; }
          onUpdateForm({transaction: {
            ..._form.transaction,
             _slippage: number 
          }});
          break;
        case 'wallets':
          if (_form.transaction._accounts?.some((account) => account === value)) {
            onUpdateForm({ transaction: {
              ..._form.transaction,
              _accounts: _form.transaction._accounts.filter((account) => account !== value),
            }});
          } else if (_form.transaction._accounts) {
            onUpdateForm({transaction: {
              ..._form.transaction,
              _accounts: [..._form.transaction._accounts, value],
            }});
          } else {
            onUpdateForm({transaction: {
              ..._form.transaction,
              _accounts: [value],
            }});
          }
        default:
      }
    },
    [onUpdateForm]
  );
  const abort = useCallback(() => {
    onAbort();
  }, [onAbort]);
  useEffect(() => {
    updateForm('0x4f498380d7F3caaB1291847C2650eF5d42283645', 'contractAddress', form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const submit = useCallback(
    (_form: SniperForm) => {
      onSubmitForm(_form);
    },
    [onSubmitForm]
  );
  return (
    <div className="flex-1 flex flex-col p-2 gap-2">
      <h2 className="text-black dark:text-zinc-300 text-lg font-semibold font-mono">
        Details
      </h2>
      <span className="w-full">
        <label
          htmlFor="contractAddress"
          className="font-label text-black dark:text-zinc-300"
        >
          Contract Address
        </label>
        <input
          placeholder="Enter a value or select from live pairs..."
          id="contractAddress"
          className="w-full py-2 px-3 rounded text-black dark:text-zinc-300 dark:bg-stone-900"
          value={form.transaction._address ?? ""}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            updateForm(event.target.value, 'contractAddress', form)
          }
        />
      </span>
      <div className="inline-flex flex-row gap-2">
        <span className="flex-col flex-1">
          <label htmlFor="amount" className="text-black dark:text-zinc-300">
            Buy Percentage
          </label>
          <input
            id="amount"
            className="w-full py-2 px-3 rounded text-black dark:text-zinc-300 dark:bg-stone-900"
            value={form.transaction._buyPercentage ?? ''}
            placeholder='0'
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateForm(event.target.value, 'buyAmount', form)
            }
          />
        </span>
        <span className="flex-col flex-1">
          <label htmlFor="slippage" className="text-black dark:text-zinc-300">
            Slippage
          </label>
          <input
            id="slippage"
            className="w-full py-2 px-3 rounded text-black dark:text-zinc-300 dark:bg-stone-900"
            value={form.transaction._slippage ?? ''}
            placeholder='0'
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateForm(event.target.value, 'slippage', form)
            }
          />
        </span>
      </div>
      <div className="inline-flex flex-row gap-2">
        <span className="flex-col flex-1">
          <label htmlFor="gas-price" className="text-black dark:text-zinc-300">
            Gas Price
          </label>
          <input
            id="gas-price"
            className="w-full py-2 px-3 rounded text-black dark:text-zinc-300 dark:bg-stone-900"
            value={form.transaction._gasPrice ?? ''}
            placeholder='0'
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateForm(event.target.value, 'gas-price', form)
            }
          />
        </span>
        <span className="flex-col flex-1">
          <label htmlFor="gas-limit" className="text-black dark:text-zinc-300">
            Gas Limit
          </label>
          <input
            id="gas-limit"
            className="w-full py-2 px-3 rounded text-black dark:text-zinc-300 dark:bg-stone-900"
            value={form.transaction._gasLimit ?? ''}
            placeholder='0'
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateForm(event.target.value, 'gas-limit', form)
            }
          />
        </span>
      </div>
      <div className="inline-flex flex-col h-40 flex-1">
        <label htmlFor="wallets" className="text-black dark:text-zinc-300">
          Wallets
        </label>
        <span
          id="wallets"
          className="w-full inline-flex flex-col gap-1 overflow-y-auto text-black dark:text-zinc-300 dark:bg-stone-900 p-2 rounded h-full"
        >
          {wallets?.map((wallet) => (
            <button
              key={wallet}
              onClick={() => updateForm(wallet, 'wallets', form)}
              type="button"
              className={`${
                form.transaction._accounts?.some((x) => x === wallet)
                  ? 'opacity-100'
                  : 'opacity-50'
              } flex flex-row items-center justify-between bg-stone-900 text-zinc-300 font-mono px-2 py-1 text-md rounded`}
            >
              <p>{wallet}</p>
              <div
                className={`${
                  form.transaction._accounts?.some((x) => x === wallet)
                    ? 'bg-green-500'
                    : 'bg-white'
                } h-6 w-6 rounded`}
              />
            </button>
          ))}
        </span>
      </div>
      <span className="flex flex-col w-full gap-2">
        {form.status === 'offline' && (
          <button
            onClick={() => submit(form)}
            type="button"
            disabled={formState === 'invalid'}
            className={`${formState === 'invalid' ? "bg-stone-500" : "bg-green-600"} py-2 rounded text-white shadow-sm shadow-[rgba(0,0,0,0.2)]`}
          >
            <p className="font-semibold">SNIPE</p>
          </button>
        )}
        {form.status === 'pending' && (
          <button
            onClick={() => abort()}
            type="button"
            className="py-2 rounded bg-rose-600 text-white shadow-sm shadow-[rgba(0,0,0,0.2)]"
          >
            <p className="font-semibold">ABORT</p>
          </button>
        )}
        {form.status === 'error' && (
          <button
            onClick={() => submit(form)}
            type="button"
            disabled
            className="py-2 rounded bg-blue-600 text-white shadow-sm shadow-[rgba(0,0,0,0.2)]"
          >
            <p className="font-semibold">ERROR</p>
          </button>
        )}
      </span>
    </div>
  );
}
