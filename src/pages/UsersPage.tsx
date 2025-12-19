import React, { useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Topbar from "../components/layout/Topbar";
import { type SidebarItemKey } from "../components/layout/Sidebar";
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserStatusMutation } from "../services/authApi";

export const UsersPage: React.FC<{ onNavigate?: (key: SidebarItemKey) => void; onLogout?: () => void }> = ({
  onNavigate,
  onLogout,
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);

  const { data, isLoading, error } = useGetUsersQuery({ page, limit, search, status });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();

  const users = data?.data?.users || [];
  const totalUsers = data?.data?.pagination?.total || 0;
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
    setStatus(e.target.value as "all" | "active" | "inactive");
    setPage(1);
  };

  const openDeleteModal = (userId: string, name: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(name);
  };

  const closeDeleteModal = () => {
    setSelectedUserId(null);
    setSelectedUserName(null);
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
    try {
      await deleteUser(selectedUserId).unwrap();
    } catch (err) {
      console.error("Failed to delete user", err);
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <PageLayout active="users" onNavigate={onNavigate} onLogout={onLogout}>
      <Topbar title="Users" showSearch={false} />

      <div className="users-header">
        <div className="left-info">
          <img src="/assets/users_icon.svg" className="user-icon" />
          <span>
            Total Users: <span>{totalUsers}</span>
          </span>
        </div>

        <div className="right-info">
          <div className="users-search-filter">
            <input
              type="text"
              className="user-search-input"
              placeholder="Search by name..."
              value={search}
              onChange={handleSearchChange}
            />
            <select className="user-filter-select" value={status} onChange={handleStatusChange}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="showing-box">
            <span>Showing</span>
            <select id="limitSelect" value={limit} onChange={handleLimitChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

        </div>
      </div>

      <div className="users-container">
        {isLoading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>Loading users...</div>
        ) : error ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#FF3030" }}>Error loading users</div>
        ) : users.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>No users found</div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status (click to toggle)</th>
                <th>Activity</th>
                <th>Signed Up</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  data-name={user.name}
                  data-status={user.status}
                  data-activity={user.activity}
                  data-date={user.signedUp}
                  className="table-row"
                >
                  <td>{user.name}</td>
                <td>
                  <span
                    className={`badge ${user.isActive ? "active" : "inactive"} badge-clickable`}
                    onClick={() => updateUserStatus({ userId: user._id, isActive: !user.isActive })}
                    title={user.isActive ? "Click to deactivate" : "Click to activate"}
                    style={{ opacity: isUpdatingStatus ? 0.6 : 1, pointerEvents: isUpdatingStatus ? "none" : "auto" }}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                  <td>{user.activity}</td>
                  <td>{user.signedUp}</td>
                  <td>
                    <span
                      className="delete-icon"
                      onClick={() => openDeleteModal(user._id, user.name)}
                      style={{ cursor: "pointer", opacity: isDeleting ? 0.6 : 1 }}
                      title="Delete user"
                    >
                      <img src="/assets/delete.svg" alt="Delete" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {selectedUserId && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-content">
            <h3>Delete User</h3>
            <p>
              Are you sure you want to delete <strong>{selectedUserName}</strong>? This action will remove them from the
              admin panel list.
            </p>
            <div className="modal-actions">
              <button className="btn-outline" onClick={closeDeleteModal} disabled={isDeleting}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleDeleteUser} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default UsersPage;

