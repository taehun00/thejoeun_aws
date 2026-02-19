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
      const data = action.payload;
      if (data?.content) {
        state.reports = data.content;
        state.page = data.pageable?.pageNumber ?? 0;
        state.size = data.pageable?.pageSize ?? 10;
        state.totalElements = data.totalElements ?? data.content.length;
      } else if (Array.isArray(data)) {
        state.reports = data;
        state.page = 0;
        state.size = data.length;
        state.totalElements = data.length;
      } else {
        state.reports = [];
        state.page = 0;
        state.size = 0;
        state.totalElements = 0;
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
