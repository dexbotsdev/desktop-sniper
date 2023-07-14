/* eslint-disable prettier/prettier */

import { ReactNode, JSX } from 'react';
import HeaderComponent from './header';
import SidebarComponent from './sidebar';

interface LayoutProps {
  children: ReactNode;
}
export default function LayoutComponent({
  children,
}: LayoutProps): JSX.Element {
  return (
    <div className="flex flex-row h-screen w-screen">
      <SidebarComponent />
      <div className="inline-flex flex-col flex-1">
        <HeaderComponent />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
