// reducers/tester/testerReducer.js
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
  searchType: "all",

  // 정렬/필터
  condition: "new", // new|old|open|close|openOnly|closeOnly

  // 상세
  detail: {
    testerid: null,
    dto: null,
    loading: false,
    error: null,
  },

  // 작성/수정/삭제
  writeLoading: false,
  writeError: null,

  updateLoading: false,
  updateError: null,

  deleteLoading: false,
  deleteError: null,

  // 관리자 토글 (공지/모집상태)
  noticeLoading: false,
  noticeError: null,

  statusLoading: false,
  statusError: null,
};

const testerSlice = createSlice({
  name: "tester",
  initialState,
  reducers: {
    //ui
    setMode(state, action) {
      state.mode = action.payload;
    },
    setPageNo(state, action) {
      state.pageNo = action.payload;
    },
    setCondition(state, action) {
      state.condition = action.payload;
    },
    setKeyword(state, action) {
      state.keyword = action.payload;
    },
    setSearchType(state, action) {
      state.searchType = action.payload;
    },

    resetSearchState(state) {
      state.mode = "list";
      state.keyword = "";
      state.searchType = "all";
      state.pageNo = 1;

      // 상세 닫기
      state.detail.testerid = null;
      state.detail.dto = null;
      state.detail.loading = false;
      state.detail.error = null;
    },

    // 리스트
    fetchTesterListRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.mode = "list";
    },
    fetchTesterListSuccess(state, action) {
      state.loading = false;
      state.error = null;

      const res = action.payload; // {total,list,paging,...}
      state.list = res?.list || [];
      state.total = res?.total || 0;
      state.paging = res?.paging || null;
    },
    fetchTesterListFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // 검색
    searchTesterRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.mode = "search";
    },
    searchTesterSuccess(state, action) {
      state.loading = false;
      state.error = null;

      const res = action.payload; // {total,list,paging,search}
      state.list = res?.list || [];
      state.total = res?.total || 0;
      state.paging = res?.paging || null;
    },
    searchTesterFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // 상세보기
    openTesterDetail(state, action) {
      state.detail.testerid = action.payload;
    },
    closeTesterDetail(state) {
      state.detail.testerid = null;
      state.detail.dto = null;
      state.detail.loading = false;
      state.detail.error = null;
    },

    fetchTesterDetailRequest(state, action) {
      state.detail.loading = true;
      state.detail.error = null;
    },
    fetchTesterDetailSuccess(state, action) {
      state.detail.loading = false;
      state.detail.error = null;
      state.detail.dto = action.payload;
    },
    fetchTesterDetailFailure(state, action) {
      state.detail.loading = false;
      state.detail.error = action.payload;
    },

    // 글쓰기-관리자
    createTesterAdminRequest(state, action) {
      state.writeLoading = true;
      state.writeError = null;
    },
    createTesterAdminSuccess(state, action) {
      state.writeLoading = false;
      state.writeError = null;
    },
    createTesterAdminFailure(state, action) {
      state.writeLoading = false;
      state.writeError = action.payload;
    },

    //글쓰기-유저
    createTesterUserRequest(state, action) {
      state.writeLoading = true;
      state.writeError = null;
    },
    createTesterUserSuccess(state, action) {
      state.writeLoading = false;
      state.writeError = null;
    },
    createTesterUserFailure(state, action) {
      state.writeLoading = false;
      state.writeError = action.payload;
    },

    // 수정-통합  
    //// payload: { testerid, dto, files, keepImgIds }
    updateTesterRequest(state, action) {
      state.updateLoading = true;
      state.updateError = null;
    },
    updateTesterSuccess(state, action) {
      state.updateLoading = false;
      state.updateError = null;
    },
    updateTesterFailure(state, action) {
      state.updateLoading = false;
      state.updateError = action.payload;
    },

    // 삭제
    deleteTesterRequest(state, action) {
      state.deleteLoading = true;
      state.deleteError = null;
    },
    deleteTesterSuccess(state, action) {
      state.deleteLoading = false;
      state.deleteError = null;
    },
    deleteTesterFailure(state, action) {
      state.deleteLoading = false;
      state.deleteError = action.payload;
    },

    // 공지여부
    toggleTesterNoticeRequest(state, action) {
      state.noticeLoading = true;
      state.noticeError = null;
    },
    toggleTesterNoticeSuccess(state, action) {
      state.noticeLoading = false;
      state.noticeError = null;

      // action.payload: { testerid, isnotice }
      const { testerid, isnotice } = action.payload || {};

      // list 반영
      state.list = (state.list || []).map((x) =>
        x?.testerid === testerid ? { ...x, isnotice } : x
      );

      // detail 반영
      if (state.detail?.dto?.testerid === testerid) {
        state.detail.dto = { ...state.detail.dto, isnotice };
      }
    },
    toggleTesterNoticeFailure(state, action) {
      state.noticeLoading = false;
      state.noticeError = action.payload;
    },

    // 모집상태여부
    toggleTesterStatusRequest(state, action) {
      state.statusLoading = true;
      state.statusError = null;
    },
    toggleTesterStatusSuccess(state, action) {
      state.statusLoading = false;
      state.statusError = null;

      // action.payload: { testerid, status }
      const { testerid, status } = action.payload || {};

      state.list = (state.list || []).map((x) =>
        x?.testerid === testerid ? { ...x, status } : x
      );

      if (state.detail?.dto?.testerid === testerid) {
        state.detail.dto = { ...state.detail.dto, status };
      }
    },
    toggleTesterStatusFailure(state, action) {
      state.statusLoading = false;
      state.statusError = action.payload;
    },

  // 작성/수정/삭제 상태 초기화
  resetTesterWriteUpdateState(state) {
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
  // UI
  setMode,
  setPageNo,
  setCondition,
  setKeyword,
  setSearchType,
  resetSearchState,

  // list/search
  fetchTesterListRequest,
  fetchTesterListSuccess,
  fetchTesterListFailure,

  searchTesterRequest,
  searchTesterSuccess,
  searchTesterFailure,

  // detail
  openTesterDetail,
  closeTesterDetail,
  fetchTesterDetailRequest,
  fetchTesterDetailSuccess,
  fetchTesterDetailFailure,

  // CRUD
  createTesterAdminRequest,
  createTesterAdminSuccess,
  createTesterAdminFailure,

  createTesterUserRequest,
  createTesterUserSuccess,
  createTesterUserFailure,

  updateTesterRequest,
  updateTesterSuccess,
  updateTesterFailure,

  deleteTesterRequest,
  deleteTesterSuccess,
  deleteTesterFailure,

  // 토글
  toggleTesterNoticeRequest,
  toggleTesterNoticeSuccess,
  toggleTesterNoticeFailure,

  toggleTesterStatusRequest,
  toggleTesterStatusSuccess,
  toggleTesterStatusFailure,


  resetTesterWriteUpdateState,
} = testerSlice.actions;

export default testerSlice.reducer;
