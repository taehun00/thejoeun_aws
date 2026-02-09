import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
  success: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // --- 회원가입 ---
    signupRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    signupSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    signupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },

    // --- 로그인 ---
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user || null;
      state.accessToken = action.payload.accessToken || null;
      state.isAuthenticated = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.accessToken = null;
    },

    // --- 토큰 재발급 ---
    refreshTokenRequest: (state) => {
      state.loading = true;
    },
    refreshTokenSuccess: (state, action) => {
      state.loading = false;
      state.accessToken = action.payload?.accessToken || null;
    },
    refreshTokenFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- 로그아웃 ---
    logoutRequest: (state, action) => {
      state.loading = true;
      // email payload를 saga에서 사용
    },
    logout: (state) => {
      state.loading = false;
      state.error = null;
      state.user = null;
      state.accessToken = null;
      state.success = false;
      state.isAuthenticated = false;
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // --- 프로필 이미지 변경 ---
    updateProfileImageRequest: (state) => {
      state.loading = true;
    },
    updateProfileImageSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
    },
    updateProfileImageFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateMeRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateMeSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
    },
    updateMeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signupRequest, signupSuccess, signupFailure,
  resetAuthState,
  loginRequest, loginSuccess, loginFailure,
  refreshTokenRequest, refreshTokenSuccess, refreshTokenFailure,
  logoutRequest, logout, logoutFailure,
  updateMeRequest,
  updateMeSuccess,
  updateMeFailure,
  updateProfileImageRequest,
  updateProfileImageSuccess,
  updateProfileImageFailure,
} = authSlice.actions;

export default authSlice.reducer;