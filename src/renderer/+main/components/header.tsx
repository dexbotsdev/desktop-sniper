/* eslint-disable prettier/prettier */
import useRestartDevServer from '../hooks/server';

export default function HeaderComponent() {
  const restartServer = useRestartDevServer();
  return (
    <div className="w-full h-12 bg-stone-800">
      <div />
      <div>
        <button type="button" onClick={restartServer}>
          Restart Server
        </button>
      </div>
    </div>
  );
}
