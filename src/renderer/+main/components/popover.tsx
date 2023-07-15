/* eslint-disable prettier/prettier */

import { ReactNode, useCallback } from "react";

interface PopoverComponentProps {
    children: ReactNode;
    open: boolean;
    onClose: () => void;
}
export default function PopoverComponent({children, open, onClose}: PopoverComponentProps) {
    const close = useCallback(() => {
        onClose()
    }, [onClose])
    return (
        <>
            <div className={`${!open ? "w-0" : "w-[30rem]"} fixed h-screen top-0 right-0 bottom-0 bg-stone-600 flex flex-col z-10 transition-all duration-200 px-3`}>
                {open && 
                <><span className="w-full">
                    <button onClick={close} type="button" className="p-3 text-xl text-white font-extrabold">
                        X
                    </button>
                </span>
                {children}
                </>}
            </div>
            <div className={`"fixed top-0 left-0 bottom-0 right-0 bg-black ${open ? "bg-opacity-20" : "bg-opacity-0"} pointer-events-none`}/>
        </>
    )
}