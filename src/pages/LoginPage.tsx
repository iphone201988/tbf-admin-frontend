import React, { useState } from "react";
import { useAdminLoginMutation } from "../services/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import type { RootState } from "../store/store";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [login, { isLoading }] = useAdminLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/admin/dashboard";
  const token = useSelector((state: RootState) => state.auth.token);

  // If already logged in, don't show login page
  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await login({ email, password }).unwrap();
      const token = res.data.token;
      const adminEmail = res.data.admin.adminEmail;
      const isAdmin = res.data.admin.isAdmin;
      dispatch(setCredentials({ token, adminEmail, isAdmin }));
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#00E6FE",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form className="login-container" onSubmit={handleSubmit}>
        <h1 className="logo">
          <img src="/assets/tbf_logo.svg" alt="logo" />
        </h1>

        <div className="inputs-container">
          <div className="input-box">
            <img src="/assets/famicons_person.svg" alt="" />
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <img src="/assets/password-solid.svg" alt="" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              src="/assets/eye-line-icon.svg"
              alt=""
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword((prev) => !prev)}
            />
          </div>

          {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}

          <button className="login-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

