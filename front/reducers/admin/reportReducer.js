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
    // ✅ 신고 목록 요청
    fetchReportsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    // ✅ 신고 목록 성공
    fetchReportsSuccess: (state, action) => {
      state.loading = false;
      const data = action.payload;

      // 페이징 정보가 있는 경우
      if (data?.content) {
        state.reports = data.content;
        state.page = data.pageable?.pageNumber ?? 0;
        state.size = data.pageable?.pageSize ?? 10;
        state.totalElements = data.totalElements ?? data.content.length;
      }
      // 배열 형태로 바로 들어오는 경우
      else if (Array.isArray(data)) {
        state.reports = data;
        state.page = 0;
        state.size = data.length;
        state.totalElements = data.length;
      }
      // 데이터 없을 경우 안전하게 초기화
      else {
        state.reports = [];
        state.page = 0;
        state.size = 0;
        state.totalElements = 0;
      }
    },

    // ✅ 신고 목록 실패
    fetchReportsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ 신고 처리 요청
    handleReportRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    // ✅ 신고 처리 성공
    handleReportSuccess: (state) => {
      state.loading = false;
    },

    // ✅ 신고 처리 실패
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
