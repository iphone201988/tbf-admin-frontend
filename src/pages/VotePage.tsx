import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetPollQuery, useVotePollMutation } from "../services/pollApi";
import { getBrowserDeviceId } from "../utils/deviceId";

const getReadableDeviceName = (userAgent: string): string => {
  try {
    const match = userAgent.match(/\(([^)]+)\)/);
    if (!match) return userAgent;
    const parts = match[1].split(";").map((p) => p.trim());
    if (parts.length >= 2) {
      return parts[1];
    }
    return parts[0] || userAgent;
  } catch {
    return userAgent;
  }
};

const VotePage: React.FC = () => {
  const { pollId } = useParams<{ pollId: string }>();
  const deviceId = getBrowserDeviceId();
  const { data, isLoading, error, refetch } = useGetPollQuery(
    { pollId: pollId || "", uniqueDeviceId: deviceId },
    { skip: !pollId }
  );
  const [votePoll, { isLoading: voting }] = useVotePollMutation();
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [locationStatus, setLocationStatus] = useState<"idle" | "locating" | "ready" | "error">("idle");
  const [voterCity, setVoterCity] = useState<string | undefined>();
  const [voterCountry, setVoterCountry] = useState<string | undefined>();
  const [locationError, setLocationError] = useState<string | null>(null);

  const poll = data?.data.poll;
  const myVote = data?.data.myVote;
  const ownerName =
    (poll as any)?.createdBy ||
    (poll as any)?.createdByName ||
    (poll as any)?.ownerName ||
    (poll as any)?.userName ||
    "Poll";

  const endsText = useMemo(() => {
    if (!poll?.pollDuration) return "";
    const end = new Date(poll.pollDuration).getTime();
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) return "Poll ended";
    const hrs = Math.floor(diff / 1000 / 60 / 60);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    return `Ends in ${hrs}h ${mins}min`;
  }, [poll?.pollDuration]);

  // Generate a random number between 2000 and 5000 for social proof
  const randomVoteCount = useMemo(() => Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000, []);

  // Initialize selection from backend myVote
  useEffect(() => {
    if (myVote) setSelected(myVote);
    if (myVote) setHasVoted(true);
  }, [myVote]);

  // Request location (reusable to re-prompt when denied)
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationError("Location not supported by browser");
      return;
    }
    setLocationStatus("locating");
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const json = await resp.json();
          const city =
            json?.address?.city ||
            json?.address?.town ||
            json?.address?.village ||
            json?.address?.county ||
            undefined;
          const country = json?.address?.country || undefined;
          setVoterCity(city);
          setVoterCountry(country);
          setLocationStatus("ready");
        } catch (err) {
          setLocationStatus("error");
          setLocationError("Unable to fetch location details.");
        }
      },
      (err) => {
        setLocationStatus("error");
        setLocationError(err.message || "Location access denied.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  };

  // Get location on load
  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVote = async () => {
    if (!pollId || !selected) return;
    setMessage(null);
    try {
      await votePoll({
        pollId,
        optionId: selected,
        uniqueDeviceId: deviceId,
        voterCity,
        voterCountry,
        voterDeviceName: getReadableDeviceName(navigator.userAgent),
      }).unwrap();
      setMessage("Vote recorded");
      setHasVoted(true);
      await refetch();
    } catch (err: any) {
      setMessage(err?.data?.message || "Vote failed");
    }
  };

  const palette = {
    bg: "#ffffff",
    accent: "#00E6FE",
    optionBg: "#d6faff",
    text: "#1E1E1E",
    subtext: "#6b6b6b",
    border: "#D2D2D2",
  };

  // vote weight visuals
  const maxVotes = poll?.options?.length ? Math.max(...poll.options.map((o) => o.voteCount || 0)) : 0;
  const topOptionId =
    maxVotes > 0
      ? poll?.options.find((o) => o.voteCount === maxVotes)?._id
      : null;
  const totalVotes = poll?.options?.reduce((sum, o) => sum + (o.voteCount || 0), 0) ?? 0;

  const isEnded = useMemo(() => {
    if (!poll?.pollDuration) return false;
    return new Date(poll.pollDuration).getTime() <= Date.now();
  }, [poll?.pollDuration]);

  // Build conic gradient for results chart
  const conic = useMemo(() => {
    if (!poll?.options?.length || totalVotes === 0) {
      return "conic-gradient(#d9d9d9 0 360deg)";
    }
    const winnerId = topOptionId;
    let start = 0;
    const slices = poll.options.map((opt, idx) => {
      const pct = (opt.voteCount / totalVotes) * 100;
      const end = start + (pct / 100) * 360;
      const colors = ["#e91e63", "#c2185b", "#ad1457", "#d81b60", "#f06292", "#ec407a"];
      let color = colors[idx % colors.length];
      if (winnerId && opt._id === winnerId) {
        color = "rgba(240, 148, 51, 1)";
      }
      const seg = `${color} ${start}deg ${end}deg`;
      start = end;
      return seg;
    });
    return `conic-gradient(${slices.join(",")})`;
  }, [poll?.options, totalVotes]);

  if (!pollId) return <div style={{ padding: 24 }}>Invalid poll link</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: palette.bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px 16px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              display: "inline-block",
              background: "#00E6FE",
              padding: "12px 18px",
              borderRadius: 14,
              marginBottom: 20,
            }}
          >
            <img src="/assets/tbf_logo.svg" alt="TBF Logo" style={{ width: 96, display: "block" }} />
          </div>
          {isLoading && <div>Loading poll...</div>}
          {error && <div style={{ color: "red" }}>Failed to load poll</div>}
          {poll && (
            <>
              <h2 style={{ fontSize: 26, margin: 0, fontWeight: 700, color: palette.text }}>{poll.pollName}</h2>
              <p style={{ color: "#00b7ff", marginTop: 2, fontSize: 14, fontWeight: 700 }}>{`${ownerName}'s Poll`}</p>
              <p style={{ fontSize: 14, margin: "12px 0 25px", color: "#525252" }}>{endsText}</p>
            </>
          )}
        </div>

        {poll && (
          <>
            {/* Active / not ended view */}
            {!isEnded && !hasVoted && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
                  {poll.options.map((opt) => {
                    const isSelected = selected === opt._id;

                    return (
                      <div
                        key={opt._id}
                        onClick={() => setSelected(opt._id)}
                        style={{
                          background: palette.optionBg,
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          padding: "16px 14px",
                          borderRadius: 12,
                          cursor: "pointer",
                          border: isSelected ? `2px solid ${palette.accent}` : "2px solid transparent",
                          boxSizing: "border-box",
                          position: "relative",
                        }}
                      >
                        <span style={{ width: 48, textAlign: "center", fontSize: 20, color: "#2b2b2b", zIndex: 1 }}>
                          {/* Crown removed */}
                        </span>
                        <span
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: isSelected ? "#0f1f2f" : palette.text,
                            zIndex: 1,
                          }}
                        >
                          {opt.optionText}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p style={{ fontSize: 14, margin: "15px 0 20px", color: palette.subtext }}>
                  Your vote is anonymous, no one will know what you voted 🫣
                </p>

                {message && (
                  <div style={{ color: message.includes("failed") ? "red" : "green", marginBottom: 12 }}>{message}</div>
                )}

                <button
                  className="vote-btn"
                  style={{
                    width: "100%",
                    padding: 16,
                    border: "none",
                    borderRadius: 12,
                    fontSize: 18,
                    fontWeight: 600,
                    background: "linear-gradient(90deg, #00e1ff, #00b7ff)",
                    color: "white",
                    cursor: voting || !selected ? "not-allowed" : "pointer",
                    marginBottom: 16,
                  }}
                  onClick={handleVote}
                  disabled={voting || !selected}
                >
                  {voting ? "Submitting..." : "Vote"}
                </button>
                {locationStatus === "error" && locationError && (
                  <div style={{ color: "#B30000", fontSize: 13, marginBottom: 12 }}>
                    {locationError} Your vote will still be recorded without location.
                  </div>
                )}

                <p style={{ color: "#00b7ff", fontSize: 15, margin: "10px 0 20px", fontStyle: "italic" }}>
                  Results for this poll will be shown once the poll ends 👀
                </p>
              </>
            )}

            {/* Thank-you view when voted and poll still active */}
            {!isEnded && hasVoted && (
              <div style={{ textAlign: "center", marginTop: 10, marginBottom: 16 }}>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 160,
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    background: "#00E6FE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "20px auto 28px",
                  }}
                >
                  <span style={{ fontSize: 56, color: "#fff" }}>✔</span>
                </div>
                <div style={{ fontSize: 14, color: "#1E1E1E", lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Your Vote has been submitted</div>
                  <div>Stay tuned for the results once the poll ends 👀</div>
                </div>
                <div style={{ marginTop: 12, fontSize: 13, color: "#1E1E1E" }}>
                  🔥 {randomVoteCount} people just tapped the button 🔥
                </div>
              </div>
            )}

            {/* Results view when poll ended */}
            {isEnded && (
              <div style={{ textAlign: "center", marginTop: 10, marginBottom: 16 }}>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 240,
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    background: conic,
                    margin: "0 auto 16px",
                    position: "relative",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      background: "#fff",
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      border: "1px solid #eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#333",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                    }}
                  >
                    {totalVotes}{" "}
                    <span style={{ fontSize: 10, marginLeft: 2, fontWeight: 500, color: "#666" }}>Votes</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {poll.options.map((opt, idx) => {
                    const pct = totalVotes > 0 ? Math.round((opt.voteCount / totalVotes) * 100) : 0;
                    const isTop = topOptionId === opt._id;
                    const colors = ["#f26c85", "#f48fb1", "#f06292", "#ec407a", "#e91e63", "#d81b60"];
                    const leftColor = isTop ? "rgba(240, 148, 51, 1)" : colors[idx % colors.length];
                    const rightColor = isTop ? "rgba(240, 148, 51, 1)" : colors[(idx + 1) % colors.length];
                    return (
                      <div
                        key={opt._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          background: isTop
                            ? "rgba(240, 148, 51, 0.16)"
                            : `linear-gradient(90deg, ${leftColor}1A, ${rightColor}1A)`,
                          borderRadius: 10,
                          padding: "10px 12px",
                          border: "1px solid #f2f2f2",
                          position: "relative",
                        }}
                      >
                        {isTop && (
                          <span style={{ position: "absolute", left: -12, top: "50%", transform: "translateY(-50%)" }}>
                            👑
                          </span>
                        )}
                        <span style={{ flex: 1, fontWeight: 600, color: "#1E1E1E", marginLeft: isTop ? 6 : 0 }}>
                          {opt.optionText}
                        </span>
                        <span style={{ fontWeight: 600, color: "#c6507c", marginRight: 8 }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div
                    style={{
                      display: "inline-block",
                      background: "#00E6FE",
                      padding: "12px 18px",
                      borderRadius: 14,
                      marginBottom: 10,
                    }}
                  >
                    <img src="/assets/tbf_logo.svg" alt="TBF Logo" style={{ width: 72, display: "block" }} />
                  </div>
                  <div style={{ fontSize: 12, color: "#1E1E1E", marginBottom: 8 }}>TBF APP</div>
                  <button
                    className="vote-btn"
                    style={{
                      width: "100%",
                      padding: 14,
                      border: "none",
                      borderRadius: 12,
                      fontSize: 16,
                      fontWeight: 600,
                      background: "linear-gradient(90deg, #00e1ff, #00b7ff)",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => (window.location.href = "/")}
                  >
                    Download Now
                  </button>
                </div>
              </div>
            )}

            <button
              className="create-btn beating-btn"
              style={{
                width: "100%",
                padding: 16,
                border: "none",
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 600,
                background: "linear-gradient(90deg, #00e1ff, #00b7ff)",
                color: "white",
                cursor: "pointer",
              }}
              onClick={() => (window.location.href = "/")}
            >
              <span className="punch-left">🤜</span>
              Create your poll
              <span className="punch-right">🤛</span>
            </button>
          </>
        )}
      </div>
    </div >
  );
};

export default VotePage;

