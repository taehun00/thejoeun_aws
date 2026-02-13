// reducers/support/csReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 목록
  list: [],
  total: 0,
  paging: null,

  // 로딩/에러
  loading: false,
  error: null,

  // 모드
  mode: "list", // "list" | "search"
  pageNo: 1,

  // 검색
  keyword: "",
  searchType: "",
  condition: "",

  // 상세 토글(질문/답변 보기)
  openIds: [], //  questionid 목록

  //  답변작성창 토글
  writeOpenIds: [], // questionid 목록

  // 유저 내 1:1 문의
  myList: [],
  myLoading: false,
  myError: null,

  // 카테고리(글쓰기 폼 사용)
  categories: [],
  categoriesLoading: false,

  // 글쓰기
  writeLoading: false,
  writeError: null,

  // 답변 상태 토글
  quickLoading: false,
  quickError: null,

  // 답변 작성 draft
  answerDraft: {
    // [questionid]: "작성 중 답변 내용"
  },
  answerWriteLoading: false,
  answerWriteError: null,
};

const csSlice = createSlice({
  name: "cs",
  initialState,
  reducers: {
    // UI 상태
    setMode(state, action) {
      state.mode = action.payload;
    },
    setPageNo(state, action) {
      state.pageNo = action.payload;
    },
    setCondition(state, action) {
      state.condition = action.payload ?? "";
    },
    setSearchType(state, action) {
      state.searchType = action.payload;
    },
    setKeyword(state, action) {
      state.keyword = action.payload;
    },

    // 질문/답변 보기 토글(행 클릭)
    toggleOpen(state, action) {
      const id = action.payload;
      const idx = state.openIds.indexOf(id);
      if (idx >= 0) state.openIds.splice(idx, 1);
      else state.openIds.push(id);
    },
    clearOpen(state) {
      state.openIds = [];
    },

    // 답변작성창 토글(버튼 클릭)
    toggleWriteOpen(state, action) {
      const id = action.payload;
      const idx = state.writeOpenIds.indexOf(id);
      if (idx >= 0) state.writeOpenIds.splice(idx, 1);
      else state.writeOpenIds.push(id);

      // 답변작성창 열면 질문 토글도 같이 열림
      if (!state.openIds.includes(id)) state.openIds.push(id);
    },
    clearWriteOpen(state) {
      state.writeOpenIds = [];
    },

    // 답변 draft
    setAnswerDraft(state, action) {
      const { questionid, value } = action.payload;
      state.answerDraft[questionid] = value;
    },
    clearAnswerDraft(state, action) {
      const { questionid } = action.payload;
      delete state.answerDraft[questionid];
    },

    // 관리자 목록
    fetchCsPagedRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCsPagedSuccess(state, action) {
      state.loading = false;
      state.list = action.payload.list ?? [];
      state.total = action.payload.total ?? 0;
      state.paging = action.payload.paging ?? null;
      state.mode = "list";
    },
    fetchCsPagedFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // 관리자 검색
    searchCsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    searchCsSuccess(state, action) {
      state.loading = false;
      state.list = action.payload.list ?? [];
      state.total = action.payload.total ?? 0;
      state.paging = action.payload.paging ?? null;
      state.mode = "search";
    },
    searchCsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // 답변상태 토글
    quickAnswerRequest(state) {
      state.quickLoading = true;
      state.quickError = null;
    },
    quickAnswerSuccess(state, action) {
      state.quickLoading = false;

      const { questionid, status } = action.payload || {};
      if (!questionid) return;

      const idx = state.list.findIndex((q) => q.questionid === questionid);
      if (idx >= 0) state.list[idx].status = status;

      // 완료로 바뀌면 작성창 닫기
      if (status === 1) {
        const widx = state.writeOpenIds.indexOf(questionid);
        if (widx >= 0) state.writeOpenIds.splice(widx, 1);
        delete state.answerDraft[questionid];
      }
    },
    quickAnswerFailure(state, action) {
      state.quickLoading = false;
      state.quickError = action.payload;
    },

    // 유저 내 1:1 질문 목록
    fetchMyCsListRequest(state) {
      state.myLoading = true;
      state.myError = null;
    },
    fetchMyCsListSuccess(state, action) {
      state.myLoading = false;
      state.myList = action.payload ?? [];
    },
    fetchMyCsListFailure(state, action) {
      state.myLoading = false;
      state.myError = action.payload;
    },

    //카테고리
    fetchCategoriesRequest(state) {
      state.categoriesLoading = true;
    },
    fetchCategoriesSuccess(state, action) {
      state.categoriesLoading = false;
      state.categories = action.payload ?? [];
    },
    fetchCategoriesFailure(state) {
      state.categoriesLoading = false;
    },

    //질문 작성
    writeQuestionRequest(state) {
      state.writeLoading = true;
      state.writeError = null;
    },
    writeQuestionSuccess(state) {
      state.writeLoading = false;
    },
    writeQuestionFailure(state, action) {
      state.writeLoading = false;
      state.writeError = action.payload;
    },

    //답변 작성
    writeAnswerRequest(state) {
      state.answerWriteLoading = true;
      state.answerWriteError = null;
    },

    writeAnswerSuccess(state, action) {
      state.answerWriteLoading = false;

      const { questionid, answer } = action.payload || {};
      if (!questionid) return;

      // draft 삭제
      delete state.answerDraft[questionid];

      // 작성창 닫기
      const widx = state.writeOpenIds.indexOf(questionid);
      if (widx >= 0) state.writeOpenIds.splice(widx, 1);

      // list 업데이트
      const idx = state.list.findIndex((q) => q.questionid === questionid);
      if (idx >= 0) {
        state.list[idx].status = 1;

        if (!Array.isArray(state.list[idx].answers)) state.list[idx].answers = [];
        if (answer) state.list[idx].answers.unshift(answer);
      }
    },

    writeAnswerFailure(state, action) {
      state.answerWriteLoading = false;
      state.answerWriteError = action.payload;
    },
  },
});

export const {
  setMode,
  setPageNo,
  setCondition,
  setSearchType,
  setKeyword,

  toggleOpen,
  clearOpen,

  toggleWriteOpen,
  clearWriteOpen,

  setAnswerDraft,
  clearAnswerDraft,

  fetchCsPagedRequest,
  fetchCsPagedSuccess,
  fetchCsPagedFailure,

  searchCsRequest,
  searchCsSuccess,
  searchCsFailure,

  quickAnswerRequest,
  quickAnswerSuccess,
  quickAnswerFailure,

  fetchMyCsListRequest,
  fetchMyCsListSuccess,
  fetchMyCsListFailure,

  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,

  writeQuestionRequest,
  writeQuestionSuccess,
  writeQuestionFailure,

  writeAnswerRequest,
  writeAnswerSuccess,
  writeAnswerFailure,
} = csSlice.actions;

export default csSlice.reducer;
