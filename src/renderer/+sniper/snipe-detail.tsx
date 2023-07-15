/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-fallthrough */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { useCallback, useState } from 'react';
import { ClientWallet } from 'renderer/+main/models/client-wallet';
import PopoverComponent from 'renderer/+main/components/popover';
import InputComponent from 'renderer/+main/components/input';
import { SniperForm } from './models';
import MultiSendFormComponent from './multi-send-form';

interface SnipeDetailProps {
  form: SniperForm;
  formState: 'invalid' | 'valid';
  wallets: ClientWallet[] | undefined;
  mainAccountBalance: number | null;
  onUpdateForm: (value: Partial<SniperForm>) => void;
  onSubmitForm: (form: SniperForm) => void;
  onAbort: () => void;
}
export default function SnipeDetailComponent({
  wallets,
  form,
  mainAccountBalance,
  formState,
  onAbort,
  onUpdateForm,
  onSubmitForm,
}: SnipeDetailProps) {
  const [popover, setPopover] = useState<boolean>(false);
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
  const submit = useCallback(
    (_form: SniperForm) => {
      onSubmitForm(_form);
    },
    [onSubmitForm]
  );
  return (
    <div className="flex-1 flex flex-col p-2 gap-2 overflow-clip">
      <h2 className="text-black dark:text-zinc-300 text-lg font-semibold font-mono">
        Details
      </h2>
      <InputComponent 
        label='contractAddress'
        placeholder="Enter a value or select from live pairs..."
        value={form.transaction._address} 
        onChange={(event) => updateForm(event, 'contractAddress', form)}/> 
      <div className="inline-flex flex-row gap-2">
        <InputComponent 
          label='buyPercentage'
          placeholder="0"
          value={form.transaction._buyPercentage} 
          onChange={(event) => updateForm(event, 'buyAmount', form)}/>
        <InputComponent 
          label='slippage'
          placeholder="0"
          value={form.transaction._slippage} 
          onChange={(event) => updateForm(event, 'slippage', form)}/> 
      </div>
      <div className="inline-flex flex-row gap-2">
        <InputComponent 
          label='gas-price'
          placeholder="0"
          value={form.transaction._gasPrice} 
          onChange={(event) => updateForm(event, 'gas-price', form)}/>
        <InputComponent 
          label='gas-limit'
          placeholder="0"
          value={form.transaction._gasLimit} 
          onChange={(event) => updateForm(event, 'gas-limit', form)}/> 
      </div>
      <div className="flex-1 overflow-y-clip">
        <div className="flex flex-row items-center justify-between">
        <label htmlFor="wallets" className="text-black dark:text-zinc-300">
          Wallets
        </label>
        <span className="flex flex-row gap-2 py-1 items-center">
          <button type="button" className="px-1 rounded bg-stone-900 text-white font-semibold">
            select all
          </button>
          <button onClick={() => setPopover(true)} type="button" className="px-1 rounded bg-stone-900 text-white font-semibold">
            send
          </button>
        </span>
        </div>
        <div
          id="wallets"
          className="w-full inline-flex flex-col gap-1 overflow-y-scroll h-full pb-12 text-black dark:text-zinc-300 dark:bg-stone-900 p-2 rounded"
        >
          {wallets?.map(({address, balance, name}) => {
            if(address){
              return (
            <button
              key={address}
              onClick={() => updateForm(address, 'wallets', form)}
              type="button"
              className={`${
                form.transaction._accounts?.some((x) => x === address)
                  ? 'opacity-100'
                  : 'opacity-50'
              } flex flex-row items-center justify-between bg-stone-900 text-zinc-300 font-mono px-2 py-1 text-md rounded`}
            >
            <p className="text-white">
                  {address?.substring(0, 10)}...
                  {address?.substring(38, 50)}
            </p>
            <p className="text-white">
              {balance?.substring(0, 6)}
            </p>
            <p className="text-white">
              {name}
            </p>
              <div
                className={`${
                  form.transaction._accounts?.some((x) => x === address)
                    ? 'bg-green-500'
                    : 'bg-white'
                } h-6 w-6 rounded`}
              />
            </button>
              )
            }
            return <></>
          }
          )}
        </div>
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
      <div className="h-[0px]">
      {popover && <PopoverComponent open={popover} onClose={() => setPopover(false)}>
              <MultiSendFormComponent mainAccountBalance={mainAccountBalance} wallets={form.transaction._accounts}/>
        </PopoverComponent>}
      </div>
    </div>
  );
}
