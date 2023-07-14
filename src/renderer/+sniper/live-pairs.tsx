/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
/* eslint-disable react/function-component-definition */

import { FC, useCallback } from 'react';
import { TokenData } from './models';

interface LivePairsProps {
  pairs: TokenData[];
  onClick: (val: TokenData) => void;
}
export const LivePairsComponent: FC<LivePairsProps> = ({ pairs, onClick }) => {
  const click = useCallback(
    (token: TokenData) => {
      onClick(token);
    },
    [onClick]
  );
  return (
    <div className="flex-col flex h-full">
      <div className="flex flex-row justify-between items-center p-2">
        <h2 className="font-mono text-xl font-semibold dark:text-zinc-300 text-black">
          Live Pairs
        </h2>
        <button type="button" className="bg-blue-600 px-2 rounded">
          <p className="text-white">type</p>
        </button>
      </div>
      <div className="flex flex-col w-full items-stretch flex-1 overflow-y-scroll p-2 gap-1">
        {pairs.map((data, idx) => (
          <button
            type="button"
            onClick={() => click(data)}
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            className="bg-white dark:bg-stone-900 dark:text-zinc-300 text-black inline-flex flex-row justify-between px-8 py-2 border-b-[1px] border-b-black border-opacity-20 rounded"
          >
            <p className="font-semibold">{data.pair}</p>
            <p className="font-semibold">
              {data.deployed_address.substring(0, 10)}...
              {data.deployed_address.substring(38, 50)}
            </p>
            <p className="font-semibold">Lp: {data.liquidity}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
