import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    reportRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    reportSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    reportFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetReportState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  reportRequest,
  reportSuccess,
  reportFailure,
  resetReportState,
} = reportSlice.actions;

export default reportSlice.reducer;
