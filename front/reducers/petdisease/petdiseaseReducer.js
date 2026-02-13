// reducers/petdisease/petdiseaseReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 목록
  list: [],
  total: 0,
  paging: null, 

  // 로딩/에러
  loading: false,
  error: null,

  // 검색/정렬/페이징
  mode: "list", // "list" | "search"
  pageNo: 1,
  pageSize: 10,

  pettypeid: null, // 필수 고정값

  keyword: "",
  condition: "new",

  // 상세(토글/단건 조회)
  detail: {
    disno: null,
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
};

const petdiseaseSlice = createSlice({
  name: "petdisease",
  initialState,
  reducers: {
    // UI 상태값 세팅 
    setMode(state, action) {
      state.mode = action.payload; // "list" | "search"
    },
    setPageNo(state, action) {
      state.pageNo = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
    },
    setPettypeid(state, action) {
      state.pettypeid = action.payload;
    },
    setKeyword(state, action) {
      state.keyword = action.payload;
    },
    setCondition(state, action) {
      state.condition = action.payload;
    },

    // 상세 토글/단건
    openDetail(state, action) {
      state.detail.disno = action.payload;
    },
    closeDetail(state) {
      state.detail.disno = null;
      state.detail.dto = null;
      state.detail.loading = false;
      state.detail.error = null;
    },


    // LIST
    fetchPetdiseaseListRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.mode = "list";
    },
    fetchPetdiseaseListSuccess(state, action) {
      state.loading = false;
      state.error = null;

      const page = action.payload; // Spring Page<Petdisease>
      state.paging = page;
      state.list = page?.content || [];
      state.total = page?.totalElements || 0;
    },
    fetchPetdiseaseListFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },


    // SEARCH
    searchPetdiseaseRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.mode = "search";
    },
    searchPetdiseaseSuccess(state, action) {
      state.loading = false;
      state.error = null;

      const page = action.payload; // Spring Page<PetdiseaseResponseDto>
      state.paging = page;
      state.list = page?.content || [];
      state.total = page?.totalElements || 0;
    },
    searchPetdiseaseFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // DETAIL
    fetchPetdiseaseDetailRequest(state, action) {
      state.detail.loading = true;
      state.detail.error = null;
    },
    fetchPetdiseaseDetailSuccess(state, action) {
      state.detail.loading = false;
      state.detail.error = null;
      state.detail.dto = action.payload;
    },
    fetchPetdiseaseDetailFailure(state, action) {
      state.detail.loading = false;
      state.detail.error = action.payload;
    },

    // CREATE
    createPetdiseaseRequest(state, action) {
      state.writeLoading = true;
      state.writeError = null;
    },
    createPetdiseaseSuccess(state, action) {
      state.writeLoading = false;
      state.writeError = null;
    },
    createPetdiseaseFailure(state, action) {
      state.writeLoading = false;
      state.writeError = action.payload;
    },


    // UPDATE
    updatePetdiseaseRequest(state, action) {
      state.updateLoading = true;
      state.updateError = null;
    },
    updatePetdiseaseSuccess(state, action) {
      state.updateLoading = false;
      state.updateError = null;
    },
    updatePetdiseaseFailure(state, action) {
      state.updateLoading = false;
      state.updateError = action.payload;
    },

    // DELETE
    deletePetdiseaseRequest(state, action) {
      state.deleteLoading = true;
      state.deleteError = null;
    },
    deletePetdiseaseSuccess(state, action) {
      state.deleteLoading = false;
      state.deleteError = null;
    },
    deletePetdiseaseFailure(state, action) {
      state.deleteLoading = false;
      state.deleteError = action.payload;
    },

    //초기화****
    resetSearchState(state) {
    state.mode = "list";
    state.keyword = "";
    state.pageNo = 1;

    // 상세 열려있으면 닫기까지 같이
    state.detail.disno = null;
    state.detail.dto = null;
    state.detail.loading = false;
    state.detail.error = null;
    },


  },
});

export const {
  // UI
  setMode,
  setPageNo,
  setPageSize,
  setPettypeid,
  setKeyword,
  setCondition,

  // detail toggle
  openDetail,
  closeDetail,

  // list
  fetchPetdiseaseListRequest,
  fetchPetdiseaseListSuccess,
  fetchPetdiseaseListFailure,

  // search
  searchPetdiseaseRequest,
  searchPetdiseaseSuccess,
  searchPetdiseaseFailure,

  // detail
  fetchPetdiseaseDetailRequest,
  fetchPetdiseaseDetailSuccess,
  fetchPetdiseaseDetailFailure,

  // CRUD
  createPetdiseaseRequest,
  createPetdiseaseSuccess,
  createPetdiseaseFailure,

  updatePetdiseaseRequest,
  updatePetdiseaseSuccess,
  updatePetdiseaseFailure,

  deletePetdiseaseRequest,
  deletePetdiseaseSuccess,
  deletePetdiseaseFailure,

  //초기화
  resetSearchState,
} = petdiseaseSlice.actions;

export default petdiseaseSlice.reducer;
