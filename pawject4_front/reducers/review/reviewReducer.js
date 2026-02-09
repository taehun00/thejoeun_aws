// reducers/reviewReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 목록
  reviews: [],
  total: 0,
  paging: null,
  mode: "list", // "list" | "search"
  pageNo: 1,
  condition: "new",

  // 상세 (토글용)
  detail: {
    reviewid: null,
    dto: null, // ReviewDto (dto 안에 reviewimglist 포함)
    loading: false,
    error: null,
  },

  // 모달 전용 (foodid 리뷰 목록)
  modal: {
    foodid: null,
    total: 0,
    list: [],
    loading: false,
    error: null,
    open: false,
  },

  // 검색
  keyword: "",
  searchType: "all",

  // 폼 데이터 (/reviewboard/form)
  formData: null,

  // 문장 순화 API (/reviewboard/reviewapi)
  polishLoading: false,
  polishResult: "",
  polishError: null,
  polishSuccess: false,

  // 등록
  writeLoading: false,
  writeSuccess: false,
  writeError: null,
  createdReviewId: null,

  // 수정
  editLoading: false,
  editSuccess: false,
  editError: null,
  updatedReviewId: null,

  // 삭제
  deleteLoading: false,
  deleteSuccess: false,
  deleteError: null,

  // 공통
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {

    // 목록
    // payload: { pageNo, condition }
    fetchReviewsRequest: (state, action) => {
      state.loading = true;
      state.error = null;
      state.mode = "list";
      state.pageNo = action.payload?.pageNo || 1;
      state.condition = action.payload?.condition || state.condition;
    },
    // payload: { list, total, paging }
    fetchReviewsSuccess: (state, action) => {
      state.loading = false;
      state.reviews = action.payload?.list || [];
      state.total = action.payload?.total || 0;
      state.paging = action.payload?.paging || null;
    },
    fetchReviewsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 검색
    // payload: { keyword, searchType, pageNo, condition }
    searchReviewsRequest: (state, action) => {
      state.loading = true;
      state.error = null;

      state.mode = "search";
      state.keyword = action.payload?.keyword || "";
      state.searchType = action.payload?.searchType || "all";
      state.pageNo = action.payload?.pageNo || 1;
      state.condition = action.payload?.condition || state.condition;
    },
    // payload: { list, total, paging }
    searchReviewsSuccess: (state, action) => {
      state.loading = false;
      state.reviews = action.payload?.list || [];
      state.total = action.payload?.total || 0;
      state.paging = action.payload?.paging || null;
    },
    searchReviewsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 정렬
    // payload: condition (string)
    setCondition: (state, action) => {
      state.condition = action.payload || "new";
    },

    // 폼 데이터 GET (/reviewboard/form)
    // payload: { reviewid? }
    fetchReviewFormRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // payload: { brandlist, foodlist, dto?, imglist? }
    fetchReviewFormSuccess: (state, action) => {
      state.loading = false;
      state.formData = action.payload;
    },
    fetchReviewFormFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.formData = null;
    },

    // 문장 순화 API (/reviewboard/reviewapi)
    // payload: { title, reviewcomment }
    reviewPolishRequest: (state) => {
      state.polishLoading = true;
      state.polishResult = "";
      state.polishError = null;
      state.polishSuccess = false;
    },
    // payload: string
    reviewPolishSuccess: (state, action) => {
      state.polishLoading = false;
      state.polishResult = action.payload || "";
      state.polishError = null;
      state.polishSuccess = true;
    },
    reviewPolishFailure: (state, action) => {
      state.polishLoading = false;
      state.polishError = action.payload;
      state.polishSuccess = false;
    },

    // 등록 (글+이미지 통합)
    // POST /reviewboard/reviewwrite
    // payload: { dto, files? }
    createReviewRequest: (state) => {
      state.writeLoading = true;
      state.writeSuccess = false;
      state.writeError = null;
      state.createdReviewId = null;
    },
    // payload: reviewid (number)
    createReviewSuccess: (state, action) => {
      state.writeLoading = false;
      state.writeSuccess = true;
      state.createdReviewId = action.payload;
    },
    createReviewFailure: (state, action) => {
      state.writeLoading = false;
      state.writeError = action.payload;
    },

    // 수정 (글+이미지 통합)
    // POST /reviewboard/reviewedit/{reviewid}
    // payload: { reviewid, dto, files? }
    updateReviewRequest: (state) => {
      state.editLoading = true;
      state.editSuccess = false;
      state.editError = null;
      state.updatedReviewId = null;
    },
    // payload: reviewid (number)
    updateReviewSuccess: (state, action) => {
      state.editLoading = false;
      state.editSuccess = true;
      state.updatedReviewId = action.payload;
    },
    updateReviewFailure: (state, action) => {
      state.editLoading = false;
      state.editError = action.payload;
    },

    // 삭제
    // DELETE /reviewboard?reviewid=xx
    // payload: reviewid
    deleteReviewRequest: (state) => {
      state.deleteLoading = true;
      state.deleteSuccess = false;
      state.deleteError = null;
    },
    // payload: reviewid
    deleteReviewSuccess: (state, action) => {
      state.deleteLoading = false;
      state.deleteSuccess = true;

      const reviewid = Number(action.payload);

      state.reviews = state.reviews.filter((r) => r.reviewid !== reviewid);
      state.total = state.total > 0 ? state.total - 1 : 0;

      if (Number(state.detail.reviewid) === reviewid) {
        state.detail.reviewid = null;
        state.detail.dto = null;
        state.detail.loading = false;
        state.detail.error = null;
      }

    },
    deleteReviewFailure: (state, action) => {
      state.deleteLoading = false;
      state.deleteError = action.payload;
    },

    // 모달 foodid 리뷰 목록
    // GET /reviewboard/reviewsearchByFoodid?foodid=xx
    // payload: foodid
    fetchModalReviewsRequest: (state, action) => {
      state.modal.loading = true;
      state.modal.error = null;
      state.modal.open = true;
      state.modal.foodid = action.payload;
    },
    // payload: { total, list }
    fetchModalReviewsSuccess: (state, action) => {
      state.modal.loading = false;
      state.modal.total = action.payload?.total || 0;
      state.modal.list = action.payload?.list || [];
    },
    fetchModalReviewsFailure: (state, action) => {
      state.modal.loading = false;
      state.modal.error = action.payload;
    },
    closeModalReviews: (state) => {
      state.modal.open = false;
      state.modal.foodid = null;
      state.modal.total = 0;
      state.modal.list = [];
      state.modal.loading = false;
      state.modal.error = null;
    },

    // 플래그 리셋
    resetReviewFlags: (state) => {
      state.writeSuccess = false;
      state.writeError = null;
      state.createdReviewId = null;

      state.editSuccess = false;
      state.editError = null;
      state.updatedReviewId = null;

      state.deleteSuccess = false;
      state.deleteError = null;

      state.polishSuccess = false;
      state.polishError = null;
    },

    // detail 토글용 (API 호출 x)
    // payload: ReviewDto
    openReviewDetail: (state, action) => {
      state.detail.reviewid = action.payload?.reviewid || null;
      state.detail.dto = action.payload || null;
      state.detail.loading = false;
      state.detail.error = null;
    },
    closeReviewDetail: (state) => {
      state.detail.reviewid = null;
      state.detail.dto = null;
      state.detail.loading = false;
      state.detail.error = null;
    },




  },
});

export const {
  fetchReviewsRequest,
  fetchReviewsSuccess,
  fetchReviewsFailure,

  searchReviewsRequest,
  searchReviewsSuccess,
  searchReviewsFailure,

  setCondition,

  fetchReviewFormRequest,
  fetchReviewFormSuccess,
  fetchReviewFormFailure,

  reviewPolishRequest,
  reviewPolishSuccess,
  reviewPolishFailure,

  createReviewRequest,
  createReviewSuccess,
  createReviewFailure,

  updateReviewRequest,
  updateReviewSuccess,
  updateReviewFailure,

  deleteReviewRequest,
  deleteReviewSuccess,
  deleteReviewFailure,

  fetchModalReviewsRequest,
  fetchModalReviewsSuccess,
  fetchModalReviewsFailure,
  closeModalReviews,

  openReviewDetail,
  closeReviewDetail,


  resetReviewFlags,
} = reviewSlice.actions;

export default reviewSlice.reducer;
