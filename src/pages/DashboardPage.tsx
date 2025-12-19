import React from "react";
import PageLayout from "../components/layout/PageLayout";
import Topbar from "../components/layout/Topbar";
import StatCard from "../components/atoms/StatCard";
import { type SidebarItemKey } from "../components/layout/Sidebar";
import { useGetDashboardStatsQuery } from "../services/authApi";

export interface DashboardPageProps {
  onNavigate?: (key: SidebarItemKey) => void;
  onLogout?: () => void;
}

const cardConfig = [
  { label: "Total Users", key: "totalUsers" as const, icon: "/assets/users_icon.svg" },
  { label: "Active Polls", key: "activePolls" as const, icon: "/assets/poll-icon.svg" },
  { label: "Total Votes", key: "totalVotes" as const, icon: "/assets/votes.svg" },
  { label: "Notifications", key: "totalNotifications" as const, icon: "/assets/notification_bell.svg" },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onLogout }) => {
  const { data, isLoading } = useGetDashboardStatsQuery();

  const stats = data?.data || {
    totalUsers: 0,
    activePolls: 0,
    totalVotes: 0,
    totalNotifications: 0,
  };

  return (
    <PageLayout active="dashboard" onNavigate={onNavigate} onLogout={onLogout}>
      <Topbar title="Dashboard" showSearch={false} />
      <div className="cards">
        {cardConfig.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={isLoading ? 0 : stats[card.key]}
            iconSrc={card.icon}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default DashboardPage;

