import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reports: [],
  page: 0,
  size: 10,
  totalElements: 0,
  loading: false,
  error: null,
};

const adminReportSlice = createSlice({
  name: "adminReport",
  initialState,
  reducers: {
    fetchReportsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchReportsSuccess: (state, action) => {
      state.loading = false;
      if (Array.isArray(action.payload)) {
        state.reports = action.payload;
        state.page = 1;
        state.size = action.payload.length;
        state.totalElements = action.payload.length;
      } else {
        state.reports = action.payload.content || [];
        state.page = action.payload.pageable?.pageNumber || 0;
        state.size = action.payload.size || 10;
        state.totalElements = action.payload.totalElements || 0;
      }
    },
    fetchReportsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    handleReportRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    handleReportSuccess: (state) => {
      state.loading = false;
    },
    handleReportFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchReportsRequest,
  fetchReportsSuccess,
  fetchReportsFailure,
  handleReportRequest,
  handleReportSuccess,
  handleReportFailure,
} = adminReportSlice.actions;

export default adminReportSlice.reducer;
