import React, { useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Topbar from "../components/layout/Topbar";
import { type SidebarItemKey } from "../components/layout/Sidebar";
import { useGetNotificationsQuery } from "../services/authApi";

export const NotificationPage: React.FC<{ onNavigate?: (key: SidebarItemKey) => void; onLogout?: () => void }> = ({
  onNavigate,
  onLogout,
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"all" | "Vote" | "PollEnd">("all");

  const { data, isLoading, error } = useGetNotificationsQuery({ page, limit, search, type });

  const notifications = data?.data?.notifications || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as "all" | "Vote" | "PollEnd");
    setPage(1);
  };

  return (
    <PageLayout active="notifications" onNavigate={onNavigate} onLogout={onLogout}>
      <Topbar title="Notifications" showSearch={false} />

      <div className="notification-container">
        <div className="n0tification-section">
          <input
            type="text"
            placeholder="Search title or message..."
            className="search-input"
            value={search}
            onChange={handleSearchChange}
          />
          <select className="user-filter-select" value={type} onChange={handleTypeChange}>
            <option value="all">All</option>
            <option value="Vote">Vote</option>
            <option value="PollEnd">Poll End</option>
          </select>
        </div>

        <h4 className="notify-title-1ax">Notifications</h4>

        <div className="notification-list">
          {isLoading ? (
            <div style={{ padding: "16px", textAlign: "center" }}>Loading...</div>
          ) : error ? (
            <div style={{ padding: "16px", textAlign: "center", color: "#FF3030" }}>Error loading notifications</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: "16px", textAlign: "center" }}>No notifications found</div>
          ) : (
            notifications.map((item) => (
              <div className="notify-item" key={item._id}>
                <div className="notify-semi-section">
                  <div className="icon-circle">
                    <img src="/assets/notification_bell.svg" />
                  </div>
                  <div className="text-block">
                    <h5>{item.title}</h5>
                    <p>{item.message}</p>
                    <p className="notification-meta">
                      {item.voter?.name && (
                        <span>
                          Voter: <strong>{item.voter.name}</strong>
                        </span>
                      )}
                      {(item.voterCity || item.voterCountry) && (
                        <span style={{ marginLeft: 8 }}>
                          {["", item.voterCity, item.voterCountry].filter(Boolean).join(", ")}
                        </span>
                      )}
                      {item.voterDeviceName && (
                        <span style={{ marginLeft: 8 }}>Device: <strong>{item.voterDeviceName}</strong></span>
                      )}
                      {item.poll?.name && (
                        <span style={{ marginLeft: 8 }}>
                          Poll: <strong>{item.poll.name}</strong>
                        </span>
                      )}
                      {item.poll?.createdByName && (
                        <span style={{ marginLeft: 8 }}>
                          Creator: <strong>{item.poll.createdByName}</strong>
                        </span>
                      )}
                      {!item.voter?.name && item.locationMessage && (
                        <span style={{ marginLeft: 8 }}>{item.locationMessage}</span>
                      )}
                    </p>
                  </div>
                </div>
                <span className="time">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              className="btn-outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Prev
            </button>
            <span className="pagination-info">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn-primary"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default NotificationPage;

