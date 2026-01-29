import React, { useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Topbar from "../components/layout/Topbar";
import { type SidebarItemKey } from "../components/layout/Sidebar";
import {
    useGetPollQuestionsQuery,
    useDeletePollQuestionMutation,
    useCreatePollQuestionMutation,
} from "../services/authApi";
import AddPollModal from "../components/AddPollModal";

export const PollQuestionsPage: React.FC<{
    onNavigate?: (key: SidebarItemKey) => void;
    onLogout?: () => void;
}> = ({ onNavigate, onLogout }) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10); // Standard limit
    const [isAddPollModalOpen, setIsAddPollModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { data, isLoading, error } = useGetPollQuestionsQuery({ page, limit });
    const [deletePollQuestion] = useDeletePollQuestionMutation();
    const [createPollQuestion, { isLoading: isCreating }] = useCreatePollQuestionMutation();

    const questions = data?.data?.pollQuestions || [];
    const totalQuestions = data?.data?.pagination?.total || 0;
    const totalPages = data?.data?.pagination?.totalPages || 1;

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(parseInt(e.target.value));
        setPage(1);
    };

    const handleDelete = async (questionId: string) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            setDeletingId(questionId);
            try {
                await deletePollQuestion(questionId).unwrap();
                // The list should auto-refresh due to tag invalidation or cache update
            } catch (err) {
                console.error("Failed to delete poll question", err);
                alert("Failed to delete poll question");
            } finally {
                setDeletingId(null);
            }
        }
    };

    const handleCreatePoll = async (pollData: { pollName: string; pollDuration: string }) => {
        try {
            await createPollQuestion({
                question: pollData.pollName,
                endTime: pollData.pollDuration,
            }).unwrap();
            setIsAddPollModalOpen(false);
            alert("Poll Question Created Successfully");
        } catch (err: any) {
            console.error("Failed to create poll question", err);
        }
    };

    return (
        <PageLayout active="pollQuestions" onNavigate={onNavigate} onLogout={onLogout}>
            <Topbar title="Poll Questions" showSearch={false} />

            <div className="users-header">
                <div className="left-info">
                    <img src="/assets/poll-icon.svg" className="user-icon" />
                    <span>
                        Total Questions: <span>{totalQuestions}</span>
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
                            cursor: "pointer",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <span>+</span> Create Poll Question
                    </button>
                    <div className="showing-box">
                        <span>Showing</span>
                        <select
                            id="limitSelect"
                            defaultValue="10"
                            onChange={handleLimitChange}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="users-container">
                {isLoading ? (
                    <div style={{ padding: "20px", textAlign: "center" }}>
                        Loading questions...
                    </div>
                ) : error ? (
                    <div
                        style={{ padding: "20px", textAlign: "center", color: "#FF3030" }}
                    >
                        Error loading questions
                    </div>
                ) : questions.length === 0 ? (
                    <div style={{ padding: "20px", textAlign: "center" }}>
                        No questions found
                    </div>
                ) : (
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>End Time</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((q: any) => (
                                <tr key={q._id} className="table-row">
                                    <td>{q.question}</td>
                                    <td>{new Date(q.endTime).toLocaleString()}</td>
                                    <td>{new Date(q.createdAt).toISOString().split("T")[0]}</td>
                                    <td>
                                        {deletingId === q._id ? (
                                            <span style={{ fontSize: "12px", color: "#FF3030" }}>Deleting...</span>
                                        ) : (
                                            <span
                                                className="delete-icon"
                                                onClick={() => handleDelete(q._id)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <img src="/assets/delete.svg" alt="Delete" />
                                            </span>
                                        )}
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

            <AddPollModal
                isOpen={isAddPollModalOpen}
                onClose={() => setIsAddPollModalOpen(false)}
                onSubmit={handleCreatePoll}
                isLoading={isCreating}
            />
        </PageLayout>
    );
};

export default PollQuestionsPage;
