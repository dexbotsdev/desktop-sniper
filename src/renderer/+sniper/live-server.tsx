/* eslint-disable prettier/prettier */

import useRestartDevServer from '../+main/hooks/server';

export default function LiveServerComponent({ logs }: { logs: string[] }) {
  const restartServer = useRestartDevServer();
  return (
    <div className="h-80 bg-stone-900 rounded p-2 flex flex-col overflow-y-scroll">
      <div className="w-full inline-flex flex-row justify-end">
        <button
          className="px-1 rounded font-semibold text-white bg-red-600"
          type="button"
          onClick={restartServer}
        >
          Restart
        </button>
      </div>
      <div>
        {logs.map((log, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <p className="text-zinc-300" key={idx}>
            {log}
          </p>
        ))}
      </div>
    </div>
  );
}
