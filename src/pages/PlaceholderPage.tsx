import React from "react";
import PageLayout from "../components/layout/PageLayout";
import Topbar from "../components/layout/Topbar";
import { type SidebarItemKey } from "../components/layout/Sidebar";

export const PlaceholderPage: React.FC<{
  title: string;
  active: SidebarItemKey;
  onNavigate?: (key: SidebarItemKey) => void;
  onLogout?: () => void;
}> = ({ title, active, onNavigate, onLogout }) => {
  return (
    <PageLayout active={active} onNavigate={onNavigate} onLogout={onLogout}>
      <Topbar title={title} />
      <div style={{ padding: "20px", color: "#1E1E1E" }}>This page will be implemented to match the original HTML.</div>
    </PageLayout>
  );
};

export default PlaceholderPage;

