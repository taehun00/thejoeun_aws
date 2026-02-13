// reducers/tester/testerCommentReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 목록
  list: [],
  total: 0,

  // 로딩/에러
  loading: false,
  error: null,

  // 현재 글(testerid)
  testerid: null,

  // 작성/수정/삭제
  writeLoading: false,
  writeError: null,

  updateLoading: false,
  updateError: null,

  deleteLoading: false,
  deleteError: null,
};

const testerCommentSlice = createSlice({
  name: "testerComment",
  initialState,
  reducers: {
    //목록 조회
    // payload: { testerid }
    fetchTesterCommentListRequest(state, action) {
      state.loading = true;
      state.error = null;

      const { testerid } = action.payload || {};
      state.testerid = testerid ?? null;
    },
    fetchTesterCommentListSuccess(state, action) {
      state.loading = false;
      state.error = null;

      state.list = action.payload || [];
      state.total = (action.payload || []).length;
    },
    fetchTesterCommentListFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // 댓작성
    createTesterCommentRequest(state, action) {
      state.writeLoading = true;
      state.writeError = null;
    },
    createTesterCommentSuccess(state, action) {
      state.writeLoading = false;
      state.writeError = null;

      const dto = action.payload;

      state.list = [...(state.list || []), dto];
      state.total = (state.list || []).length;
    },
    createTesterCommentFailure(state, action) {
      state.writeLoading = false;
      state.writeError = action.payload;
    },

//수정
    updateTesterCommentRequest(state, action) {
      state.updateLoading = true;
      state.updateError = null;
    },
    updateTesterCommentSuccess(state, action) {
      state.updateLoading = false;
      state.updateError = null;

      const dto = action.payload;

      state.list = (state.list || []).map((x) =>
        x?.testercommentid === dto?.testercommentid ? dto : x
      );
    },
    updateTesterCommentFailure(state, action) {
      state.updateLoading = false;
      state.updateError = action.payload;
    },

        //삭제
    deleteTesterCommentRequest(state, action) {
      state.deleteLoading = true;
      state.deleteError = null;
    },
    deleteTesterCommentSuccess(state, action) {
      state.deleteLoading = false;
      state.deleteError = null;

      const testercommentid = action.payload;

      state.list = (state.list || []).filter(
        (x) => x?.testercommentid !== testercommentid
      );
      state.total = (state.list || []).length;
    },
    deleteTesterCommentFailure(state, action) {
      state.deleteLoading = false;
      state.deleteError = action.payload;
    },

    //초기화
    resetTesterCommentWriteUpdateState(state) {
      state.writeLoading = false;
      state.writeError = null;

      state.updateLoading = false;
      state.updateError = null;

      state.deleteLoading = false;
      state.deleteError = null;
    },

    resetTesterCommentState(state) {
      state.list = [];
      state.total = 0;

      state.loading = false;
      state.error = null;

      state.testerid = null;

      state.writeLoading = false;
      state.writeError = null;

      state.updateLoading = false;
      state.updateError = null;

      state.deleteLoading = false;
      state.deleteError = null;
    },
  },
});

export const {
  // list
  fetchTesterCommentListRequest,
  fetchTesterCommentListSuccess,
  fetchTesterCommentListFailure,

  // create
  createTesterCommentRequest,
  createTesterCommentSuccess,
  createTesterCommentFailure,

  // update
  updateTesterCommentRequest,
  updateTesterCommentSuccess,
  updateTesterCommentFailure,

  // delete
  deleteTesterCommentRequest,
  deleteTesterCommentSuccess,
  deleteTesterCommentFailure,

  // reset
  resetTesterCommentWriteUpdateState,
  resetTesterCommentState,
} = testerCommentSlice.actions;

export default testerCommentSlice.reducer;