/* eslint-disable prettier/prettier */
/* eslint-disable react/require-default-props */
/* eslint-disable no-else-return */

import { useCallback } from "react";

interface InputProps {
    label: string;
    onChange: (event: string) => void;
    value: string | null | number;
    placeholder: string;
    inline?: boolean;
}
export default function InputComponent({label, onChange, value, inline, placeholder}: InputProps){
    const handleChange = useCallback((event: string) => {
        onChange(event);
    }, [onChange]);
    if(!inline){
    return (<div className="w-full">
        <label htmlFor={label} className="font-label text-black dark:text-zinc-300">{label}</label>
<input
  placeholder={placeholder}
  id="label"
  className="w-full py-2 px-3 rounded text-black dark:text-zinc-300 dark:bg-stone-900"
  value={value ?? ""}
  onChange={(event) => handleChange(event.target.value)}
/>
    </div>)
    } else {
        return (
            <div>
                <input
                placeholder={placeholder}
                id="label"
                className="w-full py-2 px-3 rounded text-black dark:text-zinc-300 dark:bg-stone-900"
                value={value ?? ""}
                onChange={(event) => handleChange(event.target.value)}
                />
            </div>
        )
    }
}