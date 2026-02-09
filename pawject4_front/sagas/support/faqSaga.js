// sagas/support/faqSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "../../api/axios";

import {
  fetchFaqUserRequest,
  fetchFaqAdminRequest,
  fetchFaqSuccess,
  fetchFaqFailure,

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
} from "../../reducers/support/faqReducer";
// 리스트 - 유저
function* fetchFaqUser() {
  try {
    const { data } = yield call(() => axios.get("/api/faqBoard/faquser"));
    yield put(fetchFaqSuccess(data));
  } catch (err) {
    yield put(fetchFaqFailure(err.response?.data?.message || err.message));
  }
}

// 리스트 - 관리자
function* fetchFaqAdmin() {
  try {
    const { data } = yield call(() => axios.get("/api/faqBoard/faqadmin"));
    yield put(fetchFaqSuccess(data));
  } catch (err) {
    yield put(fetchFaqFailure(err.response?.data?.message || err.message));
  }
}

// 카테고리
function* fetchFaqCategories() {
  try {
    const { data } = yield call(() => axios.get("/api/faqBoard/categories"));
    yield put(fetchFaqCategoriesSuccess(data));
  } catch (err) {
    yield put(fetchFaqCategoriesFailure(err.response?.data?.message || err.message));
  }
}

// FAQ 등록 - 관리자
function* writeFaq(action) {
  try {
    const dto = action.payload || {};
    yield call(() => axios.post("/api/faqBoard", dto));
    yield put(writeFaqSuccess());

    // 등록 후 관리자 리스트 새로고침
    yield put(fetchFaqAdminRequest());
  } catch (err) {
    yield put(writeFaqFailure(err.response?.data?.message || err.message));
  }
}

// FAQ 수정 - 관리자
function* editFaq(action) {
  try {
    const { faqid, dto } = action.payload || {};
    yield call(() => axios.put(`/api/faqBoard/${faqid}`, dto));
    yield put(editFaqSuccess());

    // 수정 후 관리자 리스트 새로고침
    yield put(fetchFaqAdminRequest());
  } catch (err) {
    yield put(editFaqFailure(err.response?.data?.message || err.message));
  }
}

// 활성화 버튼
function* activeFaq(action) {
  try {
    const { faqid } = action.payload || {};

    // 컨트롤러가 @RequestBody FAQDto 요구하므로 {}라도 body 보내야 400 안터짐
    yield call(() =>
      axios.patch(`/api/faqBoard/${faqid}/active`, {})
    );

    yield put(activeFaqSuccess());

    // 토글 후 새로고침
    yield put(fetchFaqAdminRequest());
  } catch (err) {
    yield put(activeFaqFailure(err.response?.data?.message || err.message));
  }
}

export default function* faqSaga() {
  yield takeLatest(fetchFaqUserRequest.type, fetchFaqUser);
  yield takeLatest(fetchFaqAdminRequest.type, fetchFaqAdmin);

  yield takeLatest(fetchFaqCategoriesRequest.type, fetchFaqCategories);

  yield takeLatest(writeFaqRequest.type, writeFaq);
  yield takeLatest(editFaqRequest.type, editFaq);

  yield takeLatest(activeFaqRequest.type, activeFaq);
}
