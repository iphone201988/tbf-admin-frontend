import React, { useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Topbar from "../components/layout/Topbar";
import { type SidebarItemKey } from "../components/layout/Sidebar";
import {
  useGetPollsQuery,
  useDeletePollMutation,
  useGetPollByIdAdminQuery,
} from "../services/authApi";

export const PollPage: React.FC<{ onNavigate?: (key: SidebarItemKey) => void; onLogout?: () => void }> = ({
  onNavigate,
  onLogout,
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "ended">("all");
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);

  const { data, isLoading, error } = useGetPollsQuery({ page, limit, search, status });
  const [deletePoll, { isLoading: isDeleting }] = useDeletePollMutation();
  const { data: detailData, isLoading: isLoadingDetail } = useGetPollByIdAdminQuery(selectedPollId!, {
    skip: !selectedPollId,
  });

  const polls = data?.data?.polls || [];
  const totalPolls = data?.data?.pagination?.total || 0;
  const totalPages = data?.data?.pagination?.totalPages || 1;

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value);
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as "all" | "active" | "ended");
    setPage(1);
  };

  const handleDelete = async (pollId: string) => {
    if (window.confirm("Are you sure you want to delete this poll?")) {
      try {
        await deletePoll(pollId).unwrap();
      } catch (err) {
        console.error("Failed to delete poll", err);
      }
    }
  };

  const openDetail = (pollId: string) => {
    setSelectedPollId(pollId);
  };

  const closeDetail = () => {
    setSelectedPollId(null);
  };

  return (
    <PageLayout active="poll" onNavigate={onNavigate} onLogout={onLogout}>
      <Topbar title="Polls" showSearch={false} />

      <div className="users-header">
        <div className="left-info">
          <img src="/assets/users_icon.svg" className="user-icon" />
          <span>
            Total Polls: <span>{totalPolls}</span>
          </span>
        </div>

        <div className="right-info">
          <div className="users-search-filter">
            <input
              type="text"
              className="user-search-input"
              placeholder="Search by title..."
              value={search}
              onChange={handleSearchChange}
            />
            <select className="user-filter-select" value={status} onChange={handleStatusChange}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="ended">Ended</option>
            </select>
          </div>
          <div className="showing-box">
            <span>Showing</span>
            <select id="limitSelect" defaultValue="10" onChange={handleLimitChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      <div className="users-container">
        {isLoading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>Loading polls...</div>
        ) : error ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#FF3030" }}>Error loading polls</div>
        ) : polls.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>No polls found</div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Created By</th>
                <th>Status</th>
                <th>Total Votes</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {polls.map((poll) => (
                <tr key={poll._id} className="table-row">
                  <td>{poll.pollName}</td>
                  <td>{poll.createdByName}</td>
                  <td>
                    <span className={`badge ${poll.status === "Active" ? "active" : "inactive"}`}>
                      {poll.status === "Active" ? "Active" : "Ended"}
                    </span>
                  </td>
                  <td>{poll.totalVotes}</td>
                  <td>{new Date(poll.createdAt).toISOString().split("T")[0]}</td>
                  <td>
                    <span className="eye-icon" onClick={() => openDetail(poll._id)} style={{ cursor: "pointer" }}>
                      <img src="/assets/eye-line.svg" alt="" />
                    </span>
                    <span
                      className="delete-icon"
                      onClick={() => handleDelete(poll._id)}
                      style={{ cursor: "pointer", opacity: isDeleting ? 0.6 : 1 }}
                    >
                      <img src="/assets/delete.svg" alt="" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedPollId && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-content poll-modal">
            {isLoadingDetail ? (
              <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
            ) : detailData?.data?.poll ? (
              <>
                <div className="poll-modal-header">
                  <h3>Poll Details</h3>
                  <button className="btn-outline" onClick={closeDetail}>Close</button>
                </div>
                <div className="poll-modal-body">
                  <div className="poll-modal-section">
                    <div className="poll-title">{detailData.data.poll.pollName}</div>
                    <div className="poll-meta-row">
                      <span className="poll-meta-label">Created By</span>
                      <span className="poll-meta-value">{detailData.data.poll.createdByName}</span>
                    </div>
                    <div className="poll-meta-row">
                      <span className="poll-meta-label">Status</span>
                      <span className={`badge ${detailData.data.poll.status === "Active" ? "active" : "inactive"}`}>
                        {detailData.data.poll.status === "Active" ? "Active" : "Ended"}
                      </span>
                    </div>
                    <div className="poll-meta-grid">
                      <div>
                        <div className="poll-meta-label">Total Votes</div>
                        <div className="poll-meta-value">{detailData.data.poll.totalVotes}</div>
                      </div>
                      <div>
                        <div className="poll-meta-label">Poll Ends</div>
                        <div className="poll-meta-value">
                          {detailData.data.poll.pollDuration
                            ? new Date(detailData.data.poll.pollDuration).toLocaleString()
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="poll-options-section">
                    <div className="poll-meta-label" style={{ marginBottom: 8 }}>Options</div>
                    <div className="poll-options-list">
                      {detailData.data.poll.options?.map((opt) => (
                        <div key={opt._id} className="poll-option-row">
                          <span>{opt.optionText}</span>
                          <span className="poll-option-votes">{opt.voteCount} votes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>Poll not found</div>
            )}
          </div>
        </div>
      )}

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
    </PageLayout>
  );
};

export default PollPage;

