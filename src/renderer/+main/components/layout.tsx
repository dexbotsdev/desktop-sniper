/* eslint-disable prettier/prettier */

import { ReactNode, JSX } from 'react';
import HeaderComponent from './header';
import SidebarComponent from './sidebar';
import { ClientWallet } from '../models/client-wallet';

interface LayoutProps {
  children: ReactNode;
  mainWallet: ClientWallet | undefined;
}
export default function LayoutComponent({
  mainWallet,
  children,
}: LayoutProps): JSX.Element {
  return (
    <div className="flex flex-row h-screen w-screen bg-white dark:bg-stone-950">
      <SidebarComponent />
      <div className="inline-flex flex-col flex-1">
        <HeaderComponent mainWallet={mainWallet} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
