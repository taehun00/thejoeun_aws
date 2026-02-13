// sagas/review/reviewSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "../../api/axios";

import {
  fetchReviewsRequest, fetchReviewsSuccess, fetchReviewsFailure,
  searchReviewsRequest, searchReviewsSuccess, searchReviewsFailure,
  fetchReviewFormRequest, fetchReviewFormSuccess, fetchReviewFormFailure,
  reviewPolishRequest, reviewPolishSuccess, reviewPolishFailure,
  createReviewRequest, createReviewSuccess, createReviewFailure,
  updateReviewRequest, updateReviewSuccess, updateReviewFailure,
  deleteReviewRequest, deleteReviewSuccess, deleteReviewFailure,
  fetchModalReviewsRequest, fetchModalReviewsSuccess, fetchModalReviewsFailure,
} from "../../reducers/review/reviewReducer";


// 목록
function* fetchReviews(action) {
  try {
    const { pageNo = 1, condition = "new" } = action.payload || {};

    const { data } = yield call(() =>
      axios.get("/api/reviewboard/reviewPaging", {
        params: { pageNo, ...(condition ? { condition } : {}) },
      })
    );

    yield put(fetchReviewsSuccess({ ...data }));
  } catch (err) {
    yield put(fetchReviewsFailure(err.response?.data?.message || err.message));
  }
}

// 검색 + 페이징
function* searchReviews(action) {
  try {
    const {
      keyword = "",
      searchType = "all",
      pageNo = 1,
      condition = "new",
    } = action.payload || {};

    const { data } = yield call(() =>
      axios.get("/api/reviewboard/reviewsearch", {
        params: {
          keyword,
          searchType,
          pageNo,
          ...(condition ? { condition } : {}),
        },
      })
    );

    yield put(searchReviewsSuccess({ ...data }));
  } catch (err) {
    yield put(searchReviewsFailure(err.response?.data?.message || err.message));
  }
}

// 입력/수정용 폼 데이터
function* fetchReviewForm(action) {
  try {
    const { reviewid } = action.payload || {};

    const { data } = yield call(() =>
      axios.get("/api/reviewboard/form", {
        params: reviewid ? { reviewid } : {},
      })
    );

    yield put(fetchReviewFormSuccess(data));
  } catch (err) {
    yield put(fetchReviewFormFailure(err.response?.data?.message || err.message));
  }
}

// 문장 순화 API
function reviewPolishApi(params) {
  return axios.post("/api/reviewboard/reviewapi", null, { params });
}

function* reviewPolish(action) {
  try {
    const { title, reviewcomment } = action.payload || {};
    const { data } = yield call(reviewPolishApi, { title, reviewcomment });

    yield put(reviewPolishSuccess(data));
  } catch (err) {
    yield put(reviewPolishFailure(err.response?.data?.message || err.message));
  }
}

// 등록 (글+이미지 통합)
function* createReview(action) {
  try {
    const { dto, files } = action.payload || {};
    const formData = new FormData();

    Object.entries(dto || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) formData.append(k, v);
    });

    // files 여러 개 처리 (Antd Upload 대응: originFileObj 우선)
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const f = files[i]?.originFileObj || files[i];
        if (f) formData.append("files", f);
      }
    }

    const { data } = yield call(() =>
      axios.post("/api/reviewboard/reviewwrite", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );

    yield put(createReviewSuccess(data));
  } catch (err) {
    yield put(createReviewFailure(err.response?.data?.message || err.message));
  }
}

// 수정 (글+이미지 통합)
function* updateReview(action) {
  try {
    const { reviewid, dto, files, keepImgIds } = action.payload;
    const formData = new FormData();

    Object.entries(dto || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) formData.append(k, v);
    });

    // 유지할 기존 이미지 id들
    if (keepImgIds && keepImgIds.length > 0) {
      for (let i = 0; i < keepImgIds.length; i++) {
        formData.append("keepImgIds", keepImgIds[i]);
      }
    }

    // 새 파일들 (Antd Upload 대응: originFileObj 우선)
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const f = files[i]?.originFileObj || files[i];
        if (f) formData.append("files", f);
      }
    }

    yield call(() =>
      axios.post(`/api/reviewboard/reviewedit/${reviewid}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );

    yield put(updateReviewSuccess(reviewid));
  } catch (err) {
    yield put(updateReviewFailure(err.response?.data?.message || err.message));
  }
}



// 삭제
function* deleteReview(action) {
  try {
    const { reviewid } = action.payload || {};

    yield call(() =>
      axios.delete("/api/reviewboard", { params: { reviewid } })
    );

    yield put(deleteReviewSuccess(reviewid));
  } catch (err) {
    yield put(deleteReviewFailure(err.response?.data?.message || err.message));
  }
}

// 모달 foodid 일치 리뷰 목록 - 사료검색 게시판과 연동
function* fetchModalReviews(action) {
  try {
    const foodid = action.payload;

    const { data } = yield call(() =>
      axios.get("/api/reviewboard/reviewsearchByFoodid", {
        params: { foodid },
      })
    );

    // data가 { total, list } 형태라고 가정
    yield put(fetchModalReviewsSuccess(data));
  } catch (err) {
    yield put(fetchModalReviewsFailure(err.response?.data?.message || err.message));
  }
}

export default function* reviewSaga() {
  yield takeLatest(fetchReviewsRequest.type, fetchReviews);
  yield takeLatest(searchReviewsRequest.type, searchReviews);

  yield takeLatest(fetchReviewFormRequest.type, fetchReviewForm);

  yield takeLatest(reviewPolishRequest.type, reviewPolish);

  yield takeLatest(createReviewRequest.type, createReview);
  yield takeLatest(updateReviewRequest.type, updateReview);
  yield takeLatest(deleteReviewRequest.type, deleteReview);

  yield takeLatest(fetchModalReviewsRequest.type, fetchModalReviews);
}
