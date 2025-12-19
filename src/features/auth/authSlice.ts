import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  adminEmail: string | null;
  isAdmin: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("tbf_admin_token"),
  adminEmail: localStorage.getItem("tbf_admin_email"),
  isAdmin: localStorage.getItem("tbf_admin_isAdmin") === "true",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; adminEmail: string; isAdmin: boolean }>
    ) => {
      state.token = action.payload.token;
      state.adminEmail = action.payload.adminEmail;
      state.isAdmin = action.payload.isAdmin;
      localStorage.setItem("tbf_admin_token", action.payload.token);
      localStorage.setItem("tbf_admin_email", action.payload.adminEmail);
      localStorage.setItem("tbf_admin_isAdmin", String(action.payload.isAdmin));
    },
    logout: (state) => {
      state.token = null;
      state.adminEmail = null;
      state.isAdmin = false;
      localStorage.removeItem("tbf_admin_token");
      localStorage.removeItem("tbf_admin_email");
      localStorage.removeItem("tbf_admin_isAdmin");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

