import React from "react";

export type SidebarItemKey = "dashboard" | "users" | "poll" | "pollQuestions" | "notifications" | "settings";

export interface SidebarProps {
  active?: SidebarItemKey;
  onNavigate?: (key: SidebarItemKey) => void;
  onLogout?: () => void;
}

const items: Array<{ key: SidebarItemKey; label: string; icon: string; href?: string }> = [
  { key: "dashboard", label: "Dashboard", icon: "/assets/dashboard.svg" },
  { key: "users", label: "Users", icon: "/assets/users_icon.svg" },
  { key: "poll", label: "Polls", icon: "/assets/poll-icon.svg" },
  { key: "pollQuestions", label: "All Poll Questions", icon: "/assets/poll-icon.svg" },
  { key: "notifications", label: "Notifications", icon: "/assets/notification_bell.svg" },
  { key: "settings", label: "Settings", icon: "/assets/settings.svg" },
];

export const Sidebar: React.FC<SidebarProps> = ({ active, onNavigate, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="top-section">
        <div className="logo">
          <img src="/assets/tbf_logo.svg" alt="logo" />
        </div>
        <ul className="menu">
          {items.map((item) => (
            <li
              key={item.key}
              className={active === item.key ? "active" : ""}
              onClick={() => onNavigate?.(item.key)}
            >
              <img src={item.icon} alt="" /> {item.label}
            </li>
          ))}
        </ul>
      </div>

      <button className="logout-btn" onClick={() => onLogout?.()}>
        <img src="/assets/logout_btn.svg" alt="" /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;

