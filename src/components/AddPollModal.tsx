import React, { useState } from "react";

interface AddPollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { pollName: string; pollDuration: string }) => void;
  isLoading?: boolean;
}

const AddPollModal: React.FC<AddPollModalProps> = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
  const [pollName, setPollName] = useState("");
  const [pollDuration, setPollDuration] = useState("");
  const [errors, setErrors] = useState<{ pollName?: string; pollDuration?: string }>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { pollName?: string; pollDuration?: string } = {};

    if (!pollName.trim()) {
      newErrors.pollName = "Poll name is required";
    }

    if (!pollDuration) {
      newErrors.pollDuration = "Poll duration is required";
    } else {
      const selectedDate = new Date(pollDuration);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.pollDuration = "Poll duration must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      pollName: pollName.trim(),
      pollDuration: new Date(pollDuration).toISOString(),
    });
  };

  const resetForm = () => {
    setPollName("");
    setPollDuration("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="confirm-modal-overlay" onClick={handleClose}>
      <div className="confirm-modal-content poll-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
        <div className="poll-modal-header">
          <h3>Create Poll Question</h3>
          <button className="btn-outline" onClick={handleClose} disabled={isLoading}>
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="poll-modal-body">
            <div className="poll-modal-section">
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#1E1E1E" }}>
                Poll Name <span style={{ color: "#FF3030" }}>*</span>
              </label>
              <input
                type="text"
                value={pollName}
                onChange={(e) => {
                  setPollName(e.target.value);
                  if (errors.pollName) setErrors({ ...errors, pollName: undefined });
                }}
                placeholder="Enter poll question"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: errors.pollName ? "1px solid #FF3030" : "1px solid #D2D2D2",
                  fontSize: "14px",
                  outline: "none",
                }}
                disabled={isLoading}
              />
              {errors.pollName && (
                <div style={{ color: "#FF3030", fontSize: "12px", marginTop: "4px" }}>{errors.pollName}</div>
              )}
            </div>

            <div className="poll-modal-section">
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#1E1E1E" }}>
                Poll End Date & Time <span style={{ color: "#FF3030" }}>*</span>
              </label>
              <input
                type="datetime-local"
                value={pollDuration}
                onChange={(e) => {
                  setPollDuration(e.target.value);
                  if (errors.pollDuration) setErrors({ ...errors, pollDuration: undefined });
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: errors.pollDuration ? "1px solid #FF3030" : "1px solid #D2D2D2",
                  fontSize: "14px",
                  outline: "none",
                }}
                disabled={isLoading}
              />
              {errors.pollDuration && (
                <div style={{ color: "#FF3030", fontSize: "12px", marginTop: "4px" }}>{errors.pollDuration}</div>
              )}
            </div>
          </div>

          <div className="modal-actions" style={{ marginTop: 20 }}>
            <button type="button" className="btn-outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Poll Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPollModal;

