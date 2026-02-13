// reducers/food/foodSearchReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // init
  initData: {
    brandList: [],
    foodList: [],
    nutrientList: [],
    rangeList: [],
  },
  initLoading: false,
  initError: null,

  // 검색 결과
  list: [],
  total: 0,
  paging: null,
  loading: false,
  error: null,

  // 필터(화면 상태)
  filters: {
    keyword: "",
    pettypeid: null,
    foodtype: null,
    brandid: null,
    foodid: null,
    category: null,
    petagegroup: null,
    isgrainfree: null,
    origin: null,
    rangeid: null,
    minvalue: null,
    maxvalue: null,
    condition: null,
  },
  pstartno: 1,

  // AI 필터 변환
  ai: {
    loading: false,
    result: null,
    error: null,
    open: false,
  },

  // 상세 모달
  modal: {
    open: false,
    foodid: null,
    loading: false,
    dto: null,
    error: null,
  },
};

const petfoodSearchSlice = createSlice({
  name: "petfoodSearch",
  initialState,
  reducers: {
    // init
    fetchInitRequest: (state) => {
      state.initLoading = true;
      state.initError = null;
    },
    fetchInitSuccess: (state, action) => {
      state.initLoading = false;
      state.initData = action.payload;
    },
    fetchInitFailure: (state, action) => {
      state.initLoading = false;
      state.initError = action.payload;
    },

    // filter set
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...(action.payload || {}) };
    },
    resetFilters: (state) => {
      state.filters = { ...initialState.filters };
      state.pstartno = 1;
    },
    setPstartno: (state, action) => {
      state.pstartno = action.payload || 1;
    },

    // search
    searchFilterPagingRequest: (state, action) => {
      state.loading = true;
      state.error = null;

      // 요청 페이지번호 store에 즉시 반영 (UI 꼬임 방지)
      // payload가 { pstartno }
      if (action?.payload?.pstartno !== undefined && action?.payload?.pstartno !== null) {
        state.pstartno = action.payload.pstartno;
      }
    },
    searchFilterPagingSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload?.list || [];
      state.total = action.payload?.total || 0;
      state.paging = action.payload?.paging || null;

      // 성공 시에도 pstartno를 paging 기반으로 동기화 (서버 paging 기준 최종 확정)
      // UtilPaging 구조가 프로젝트마다 다를 수 있으니 방어적으로 처리
      const serverPage =
        action.payload?.paging?.pstartno ||
        action.payload?.paging?.pageNo ||
        action.payload?.paging?.currentPage;

      if (serverPage) {
        state.pstartno = serverPage;
      }
    },
    searchFilterPagingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ai
    openAiBox: (state) => {
      state.ai.open = true;
    },
    closeAiBox: (state) => {
      state.ai.open = false;
    },
    foodApiRequest: (state) => {
      state.ai.loading = true;
      state.ai.error = null;
      state.ai.result = null;
    },
    foodApiSuccess: (state, action) => {
      state.ai.loading = false;
      state.ai.result = action.payload;
    },
    foodApiFailure: (state, action) => {
      state.ai.loading = false;
      state.ai.error = action.payload;
    },

    // modal card
    openModal: (state, action) => {
      state.modal.open = true;
      state.modal.foodid = action.payload;
      state.modal.dto = null;
      state.modal.error = null;
    },
    closeModal: (state) => {
      state.modal.open = false;
      state.modal.foodid = null;
      state.modal.dto = null;
      state.modal.error = null;
    },
    fetchModalCardRequest: (state) => {
      state.modal.loading = true;
      state.modal.error = null;
      state.modal.dto = null;
    },
    fetchModalCardSuccess: (state, action) => {
      state.modal.loading = false;
      state.modal.dto = action.payload;
    },
    fetchModalCardFailure: (state, action) => {
      state.modal.loading = false;
      state.modal.error = action.payload;
    },
  },
});

export const {
  fetchInitRequest,
  fetchInitSuccess,
  fetchInitFailure,

  setFilters,
  resetFilters,
  setPstartno,

  searchFilterPagingRequest,
  searchFilterPagingSuccess,
  searchFilterPagingFailure,

  openAiBox,
  closeAiBox,
  foodApiRequest,
  foodApiSuccess,
  foodApiFailure,

  openModal,
  closeModal,
  fetchModalCardRequest,
  fetchModalCardSuccess,
  fetchModalCardFailure,
} = petfoodSearchSlice.actions;

export default petfoodSearchSlice.reducer;