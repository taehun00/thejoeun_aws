// reducers/support/faqReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 리스트
  list: [],
  loading: false,
  error: null,

  // admin/user 구분용
  mode: "user", // "user" | "admin"

  // 토글 상세 (리스트에서 클릭해서 답변 펼치기)
  openId: null,

  // 카테고리
  categories: [],
  categoriesLoading: false,
  categoriesError: null,

  // write / edit
  writeLoading: false,
  writeError: null,

  editLoading: false,
  editError: null,

  // 활성화 토글
  activeLoading: false,
  activeError: null,
};

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    // 리스트
    fetchFaqUserRequest(state) {
      state.loading = true;
      state.error = null;
      state.mode = "user";
    },
    fetchFaqAdminRequest(state) {
      state.loading = true;
      state.error = null;
      state.mode = "admin";
    },
    fetchFaqSuccess(state, action) {
      state.loading = false;
      state.list = action.payload || [];
    },
    fetchFaqFailure(state, action) {
      state.loading = false;
      state.error = action.payload || "FAQ 목록 조회 실패";
    },

    // 토글 상세
    toggleFaqOpen(state, action) {
      const faqid = action.payload;
      state.openId = state.openId === faqid ? null : faqid;
    },
    closeFaqOpen(state) {
      state.openId = null;
    },

    // 카테고리
    fetchFaqCategoriesRequest(state) {
      state.categoriesLoading = true;
      state.categoriesError = null;
    },
    fetchFaqCategoriesSuccess(state, action) {
      state.categoriesLoading = false;
      state.categories = action.payload || [];
    },
    fetchFaqCategoriesFailure(state, action) {
      state.categoriesLoading = false;
      state.categoriesError = action.payload || "카테고리 조회 실패";
    },

    // 글쓰기
    writeFaqRequest(state, action) {
      state.writeLoading = true;
      state.writeError = null;
    },
    writeFaqSuccess(state) {
      state.writeLoading = false;
    },
    writeFaqFailure(state, action) {
      state.writeLoading = false;
      state.writeError = action.payload || "FAQ 등록 실패";
    },

    // 수정
    editFaqRequest(state, action) {
      state.editLoading = true;
      state.editError = null;
    },
    editFaqSuccess(state) {
      state.editLoading = false;
    },
    editFaqFailure(state, action) {
      state.editLoading = false;
      state.editError = action.payload || "FAQ 수정 실패";
    },

    // 활성화
    activeFaqRequest(state, action) {
      state.activeLoading = true;
      state.activeError = null;
    },
    activeFaqSuccess(state) {
      state.activeLoading = false;
    },
    activeFaqFailure(state, action) {
      state.activeLoading = false;
      state.activeError = action.payload || "FAQ 활성화 토글 실패";
    },

    // 초기화
    resetFaqErrors(state) {
      state.error = null;
      state.categoriesError = null;
      state.writeError = null;
      state.editError = null;
      state.activeError = null;
    },
  },
});

export const {
  fetchFaqUserRequest,
  fetchFaqAdminRequest,
  fetchFaqSuccess,
  fetchFaqFailure,

  toggleFaqOpen,
  closeFaqOpen,

  fetchFaqCategoriesRequest,
  fetchFaqCategoriesSuccess,
  fetchFaqCategoriesFailure,

  writeFaqRequest,
  writeFaqSuccess,
  writeFaqFailure,

  editFaqRequest,
  editFaqSuccess,
  editFaqFailure,

  activeFaqRequest,
  activeFaqSuccess,
  activeFaqFailure,

  resetFaqErrors,
} = faqSlice.actions;

export default faqSlice.reducer;
