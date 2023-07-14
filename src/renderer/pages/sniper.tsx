/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import { useEffect } from 'react';
import LayoutComponent from 'renderer/+main/components/layout';
import useSniperForm from 'renderer/+sniper/hooks/form';
import { usePairsWebsocket } from 'renderer/+sniper/hooks/live-pairs';
import { LivePairsComponent } from 'renderer/+sniper/live-pairs';
import LiveServerComponent from 'renderer/+sniper/live-server';
import SnipeDetailComponent from 'renderer/+sniper/snipe-detail';

export default function SniperPage() {
  const { pairs, closeConnection } = usePairsWebsocket();
  const { form, updateForm, submitForm } = useSniperForm();
  useEffect(() => {
    return () => closeConnection();
  }, [closeConnection]);
  return (
    <LayoutComponent>
      <div className="h-full w-full flex flex-col gap-2 p-2">
        <div className="bg-lime-200 rounded inline-flex flex-row flex-1 overflow-clip p-2 gap-2">
          <SnipeDetailComponent
            onSubmitForm={(_form) => submitForm(_form)}
            onUpdateForm={(value) => updateForm(value)}
            form={form}
          />
          <LiveServerComponent />
        </div>
        <div className="h-1/2 rounded bg-lime-300">
          <LivePairsComponent
            onClick={(token) => updateForm({ token })}
            pairs={pairs}
          />
        </div>
      </div>
    </LayoutComponent>
  );
}
