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
    <div className="">
      <h2 className="font-mono text-xl p-2 font-semibold">Live Pairs</h2>
      <div className="flex flex-col w-full items-stretch flex-1 overflow-y-scroll">
        {pairs.map((data) => (
          <button
            type="button"
            onClick={() => click(data)}
            key={data.deployed_address}
            className="bg-white inline-flex flex-row justify-between px-8 py-2 border-b-[1px] border-b-black border-opacity-20"
          >
            <p className="font-semibold">{data.pair}</p>
            <p className="font-semibold">{data.deployed_address}</p>
            <p className="font-semibold">Lp: {data.liquidity}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
