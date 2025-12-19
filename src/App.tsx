import React from "react";
import "./App.css";
import "./styles/style.css";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import PollPage from "./pages/PollPage";
import NotificationPage from "./pages/NotificationPage";
import VotePage from "./pages/VotePage";
import LandingPage from "./pages/LandingPage";
import { type SidebarItemKey } from "./components/layout/Sidebar";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import RequireAuth from "./routes/RequireAuth";
import LoginPage from "./pages/LoginPage";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./features/auth/authSlice";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import type { RootState } from "./store/store";

const routeMap: Record<SidebarItemKey, string> = {
  dashboard: "/admin/dashboard",
  users: "/admin/users",
  poll: "/admin/poll",
  notifications: "/admin/notifications",
  settings: "/admin/settings",
};

const withNav = (Component: React.FC<{ onNavigate: (key: SidebarItemKey) => void; onLogout: () => void }>) => {
  return () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleNavigate = (key: SidebarItemKey) => navigate(routeMap[key]);
    const handleLogout = () => {
      dispatch(logout());
      navigate("/admin/login", { replace: true });
    };
    return <Component onNavigate={handleNavigate} onLogout={handleLogout} />;
  };
};

function App() {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* If already logged in, prevent viewing login page and send to admin dashboard */}
      <Route
        path="/admin/login"
        element={token ? <Navigate to="/admin/dashboard" replace /> : <LoginPage />}
      />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      {/* Public vote route from shareable link */}
      <Route path="/poll/:pollId" element={<VotePage />} />

      <Route element={<RequireAuth />}>
        <Route path="/admin/dashboard" element={withNav(DashboardPage)()} />
        <Route path="/admin/users" element={withNav(UsersPage)()} />
        <Route path="/admin/poll" element={withNav(PollPage)()} />
        <Route path="/admin/notifications" element={withNav(NotificationPage)()} />
        <Route
          path="/admin/settings"
          element={withNav(
            (props) => <PlaceholderPage title="Settings" active="settings" {...props} />
          )()}
        />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
