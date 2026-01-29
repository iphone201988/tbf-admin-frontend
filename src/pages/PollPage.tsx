import React, { useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Topbar from "../components/layout/Topbar";
import { type SidebarItemKey } from "../components/layout/Sidebar";
import {
  useGetPollsQuery,
  useDeletePollMutation,
  useGetPollByIdAdminQuery,
  useCreatePollQuestionMutation,
} from "../services/authApi";
import AddPollModal from "../components/AddPollModal";

export const PollPage: React.FC<{ onNavigate?: (key: SidebarItemKey) => void; onLogout?: () => void }> = ({
  onNavigate,
  onLogout,
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "ended">("all");
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
  const [isAddPollModalOpen, setIsAddPollModalOpen] = useState(false);

  // We keep using useGetPollsQuery for the list because the requirement didn't explicitly say to list the new questions here, 
  // but if the user wants to "Create Poll Question" it implies future polls will be of this new type?
  // However, the "Create Poll" button now only creates questions.
  // The table likely still shows legacy polls or needs to support new questions.
  // For now, I will assume the table functionality remains until specified otherwise, 
  // but the CREATION action now hits the new endpoint.

  const { data, isLoading, error } = useGetPollsQuery({ page, limit, search, status });
  const [deletePoll, { isLoading: isDeleting }] = useDeletePollMutation();
  // Using the new mutation
  const [createPollQuestion, { isLoading: isCreating }] = useCreatePollQuestionMutation();
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

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      // Optionally show a toast notification
      alert("Link copied to clipboard!");
    }).catch((err) => {
      console.error("Failed to copy link", err);
    });
  };

  const handleCreatePoll = async (pollData: { pollName: string; pollDuration: string }) => {
    try {
      // Mapping pollName to question and pollDuration to endTime
      await createPollQuestion({
        question: pollData.pollName,
        endTime: pollData.pollDuration,
      }).unwrap();
      setIsAddPollModalOpen(false);
      // Optionally show success message
      alert("Poll Question Created Successfully");
      // Redirect to "All Poll Questions" page
      onNavigate?.("pollQuestions");
    } catch (err: any) {
      console.error("Failed to create poll question", err);
      // Optionally show error message
    }
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
          <button
            onClick={() => setIsAddPollModalOpen(true)}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(90deg, #00E6FE, #00b7ff)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>+</span> Create Poll Question
          </button>
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
                <th>Poll Link</th>
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
                  <td>
                    {poll.shareAble ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <a
                          href={poll.shareAble}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            color: "#00E6FE",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.textDecoration = "underline";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.textDecoration = "none";
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ flexShrink: 0 }}
                          >
                            <path
                              d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46997L11.75 5.17997"
                              stroke="#00E6FE"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14 11C13.5705 10.4259 13.0226 9.95085 12.3934 9.60707C11.7643 9.26329 11.0685 9.05886 10.3533 9.00766C9.63816 8.95645 8.92037 9.05972 8.24863 9.31028C7.57689 9.56084 6.96688 9.95304 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.6661 2.05659 16.977C2.06798 18.288 2.59382 19.5421 3.52086 20.4691C4.4479 21.3962 5.70197 21.922 7.01295 21.9334C8.32393 21.9448 9.58694 21.4408 10.53 20.53L12.24 18.82"
                              stroke="#00E6FE"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            Open
                          </span>
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyLink(poll.shareAble!);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px 6px",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "4px",
                            transition: "background 0.2s",
                          }}
                          title="Copy link"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#f0f0f0";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"
                              fill="#6b6b6b"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "#999", fontSize: "14px" }}>N/A</span>
                    )}
                  </td>
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

      <AddPollModal
        isOpen={isAddPollModalOpen}
        onClose={() => setIsAddPollModalOpen(false)}
        onSubmit={handleCreatePoll}
        isLoading={isCreating}
      />
    </PageLayout>
  );
};

export default PollPage;

