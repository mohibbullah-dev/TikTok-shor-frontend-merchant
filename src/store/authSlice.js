import { createSlice } from "@reduxjs/toolkit";

// Get initial state from localStorage
const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const tokenFromStorage = localStorage.getItem("token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage,
    token: tokenFromStorage,
    merchant: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    // Called after successful login
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.merchant = action.payload.merchant || null;
      state.error = null;
      // Save to localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    // Called after logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.merchant = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    // Update merchant data
    updateMerchant: (state, action) => {
      state.merchant = action.payload;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { loginSuccess, logout, updateMerchant, setLoading, setError } =
  authSlice.actions;

export default authSlice.reducer;
