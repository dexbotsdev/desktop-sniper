/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable default-case */
import { FormEvent, useCallback, useEffect, useState } from "react";

interface MultiWalletForm {
    transaction: {
        wallets: string[] | null;
        amount: number | null;
    };
    valid: boolean;
    loading: boolean;
}
export default function MultiSendFormComponent({wallets, mainAccountBalance}: {wallets: string[] | null, mainAccountBalance: number | null}){
    const [form, setForm] = useState<MultiWalletForm>({
        transaction: { 
            wallets,
            amount: null,
         },
        loading: false,
        valid: false,
    });
    const onSubmit = useCallback((event: FormEvent<HTMLFormElement>,_form: MultiWalletForm) => {
        event.preventDefault();
        setForm(prev => ({...prev, loading: true}));
        fetch(`http://localhost:8000/api/wallet/multisend`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(_form.transaction),
          }).then((data) => {
            console.log(data);
            setForm(prev => ({...prev, loading: false}));
            return null;
          }).catch((err) => {
            console.log(err)
            setForm(prev => ({...prev, loading: false}));
        });
    }, []);
    useEffect(() => {
        setForm((prev) => ({...prev, 
            transaction: {
            ...prev.transaction,
            wallets
        }}))
    }, [wallets])
    useEffect(() => {
        setForm((prev) => {
            if(
                !prev.transaction.amount ||
                !prev.transaction.wallets ||
                prev.transaction.wallets.length === 0 ||
                prev.transaction.amount > Number(mainAccountBalance)
            ){
                return {...prev, valid: false};
            }
            return {...prev, valid: true};
        })
    }, [form.transaction.amount,form.transaction.wallets, mainAccountBalance]);
    const updateForm = useCallback((value: string, type: 'amount') => {
        switch(type){
            case 'amount':
                    setForm((prev) => ({...prev, transaction: {
                        ...prev.transaction,
                        amount: value as unknown as number
                    }}))
            break;
        }
    }, []);
    return (
        <form onSubmit={(event) => onSubmit(event,form)} className="w-full flex flex-col gap-2">
            <span className="bg-stone-800 rounded p-2">
            <p className="text-lg font-semibold text-white">Multi send eth to these wallets..</p>
                <p className="text-white">Available balance: {mainAccountBalance}</p>
            </span>
            <span className="bg-stone-800 p-2 rounded">
            {form.transaction.wallets?.map((address) => {
                return (
                    <p key={address} className="text-md text-white">
                        {address?.substring(0, 10)}...
                        {address?.substring(38, 50)}
                    </p>
                )
            })}
            </span>
            amount
            <input
                placeholder="0"
                id="label"
                type="number"
                step="any"
                className="w-full py-2 px-3 rounded text-black dark:text-zinc-300 dark:bg-stone-900"
                value={form.transaction.amount ?? ""}
                onChange={(event) => updateForm(event.target.value, 'amount')}
                />
            {!form.loading && form.valid && <button type="submit" className="p-2 bg-green-600  rounded">
                <p className="text-white text-lg font-semibold">SUBMIT</p>
            </button>}
            {!form.loading && !form.valid && <button className="p-2 bg-stone-700  rounded" type="button">
                <p className="text-stone-400 text-lg font-semibold">SUBMIT</p>
            </button>}
            {form.loading && <button className="" type="button" disabled>
                <p className="text-stone-400 text-lg font-semibold">PENDING</p>
            </button>}
        </form>
    )
}