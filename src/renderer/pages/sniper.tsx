/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import { useEffect } from 'react';
import LayoutComponent from 'renderer/+main/components/layout';
import useSniperForm from 'renderer/+sniper/hooks/form';
import usePairsWebsocket from 'renderer/+sniper/hooks/live-pairs';
import useLoggerWebSocket from 'renderer/+sniper/hooks/live-server';
import useGetMainWallet from 'renderer/+sniper/hooks/main-wallet';
import { useGetSniperWallets } from 'renderer/+sniper/hooks/wallets';
import { LivePairsComponent } from 'renderer/+sniper/live-pairs';
import LiveServerComponent from 'renderer/+sniper/live-server';
import SnipeDetailComponent from 'renderer/+sniper/snipe-detail';

export default function SniperPage() {
  const { logs, closeLoggerConnection } = useLoggerWebSocket();
  const { pairs, closeConnection, openConnection } = usePairsWebsocket();
  const { form, updateForm, submitForm, abort } = useSniperForm();
  const { wallets } = useGetSniperWallets();
  const { wallet } = useGetMainWallet();
  useEffect(() => {
    openConnection();
    return () => {
      closeLoggerConnection();
      closeConnection();
    };
  }, [closeConnection, openConnection, closeLoggerConnection]);
  return (
    <LayoutComponent mainWallet={wallet}>
      <div className="h-full w-full flex flex-row gap-2 p-2">
        <div className="bg-stone-200 dark:bg-stone-800 rounded inline-flex flex-col flex-1 overflow-clip p-2 gap-2 shadow-sm shadow-[rgba(0,0,0,0.2)]">
          <SnipeDetailComponent
            onAbort={abort}
            onSubmitForm={(_form) => submitForm(_form)}
            onUpdateForm={(value) => updateForm(value)}
            form={form}
            wallets={wallets}
          />
          <LiveServerComponent logs={logs} />
        </div>
        <div className="rounded bg-stone-100 dark:bg-stone-800 flex-1 shadow-sm shadow-[rgba(0,0,0,0.2)]">
          <LivePairsComponent
            onClick={(_address) => updateForm({ transaction: {...form.transaction, _address } })}
            pairs={pairs}
          />
        </div>
      </div>
    </LayoutComponent>
  );
}
