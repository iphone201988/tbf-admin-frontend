import React from "react";
import Sidebar, { type SidebarItemKey } from "./Sidebar";

export interface PageLayoutProps {
  active?: SidebarItemKey;
  onNavigate?: (key: SidebarItemKey) => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ active, onNavigate, onLogout, children }) => {
  return (
    <div className="container">
      <Sidebar active={active} onNavigate={onNavigate} onLogout={onLogout} />
      <main className="main">{children}</main>
    </div>
  );
};

export default PageLayout;

