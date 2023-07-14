/* eslint-disable no-fallthrough */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { ChangeEvent, useCallback, useEffect } from 'react';
import { SniperForm } from './models';

interface SnipeDetailProps {
  form: SniperForm;
  wallets: string[] | undefined;
  onUpdateForm: (value: Partial<SniperForm>) => void;
  onSubmitForm: (form: SniperForm) => void;
  onAbort: () => void;
}
export default function SnipeDetailComponent({
  wallets,
  form,
  onAbort,
  onUpdateForm,
  onSubmitForm,
}: SnipeDetailProps) {
  const updateForm = useCallback(
    (
      value: string,
      key: 'slippage' | 'buyAmount' | 'wallets' | 'contractAddress',
      _form?: SniperForm
    ) => {
      const number = Number(value);
      switch (key) {
        case 'contractAddress':
          onUpdateForm({
            token: {
              token0: value,
              token1: '',
              pairAddress: '',
              deployed_address: value,
              pair: 'weth',
              liquidity: '',
            },
          });
          break;
        case 'buyAmount':
          onUpdateForm({ buyAmountInEth: number });
          break;
        case 'slippage':
          onUpdateForm({ slippage: number });
          break;
        case 'wallets':
          if (!_form) {
            return;
          }
          if (_form.wallets?.some((wallet) => wallet === value)) {
            onUpdateForm({
              wallets: _form.wallets.filter((wallet) => wallet !== value),
            });
          } else if (_form.wallets) {
            onUpdateForm({ wallets: [..._form.wallets, value] });
          } else {
            onUpdateForm({ wallets: [value] });
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
    updateForm('0x4f498380d7F3caaB1291847C2650eF5d42283645', 'contractAddress');
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
          value={form.token?.deployed_address}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            updateForm(event.target.value, 'contractAddress')
          }
        />
      </span>
      <div className="inline-flex flex-row gap-2">
        <span className="flex-col flex-1">
          <label htmlFor="amount" className="text-black dark:text-zinc-300">
            Buy Amount
          </label>
          <input
            id="amount"
            className="w-full py-2 px-3 rounded text-black dark:text-zinc-300 dark:bg-stone-900"
            value={form.buyAmountInEth}
            type="number"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateForm(event.target.value, 'buyAmount')
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
            value={form.slippage}
            type="number"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateForm(event.target.value, 'slippage')
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
                form.wallets?.some((x) => x === wallet)
                  ? 'opacity-100'
                  : 'opacity-50'
              } flex flex-row items-center justify-between bg-stone-900 text-zinc-300 font-mono px-2 py-1 text-md rounded`}
            >
              <p>{wallet}</p>
              <div
                className={`${
                  form.wallets?.some((x) => x === wallet)
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
            className="py-2 rounded bg-green-600 text-white shadow-sm shadow-[rgba(0,0,0,0.2)]"
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
