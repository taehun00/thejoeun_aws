// sagas/support/csSaga.js
import { call, put, takeLatest, select } from "redux-saga/effects";
import axios from "../../api/axios";

import {
  fetchCsPagedRequest, fetchCsPagedSuccess, fetchCsPagedFailure,
  searchCsRequest, searchCsSuccess, searchCsFailure,
  quickAnswerRequest, quickAnswerSuccess, quickAnswerFailure,
  fetchMyCsListRequest, fetchMyCsListSuccess, fetchMyCsListFailure,
  fetchCategoriesRequest, fetchCategoriesSuccess, fetchCategoriesFailure,
  writeQuestionRequest, writeQuestionSuccess, writeQuestionFailure,
  writeAnswerRequest, writeAnswerSuccess, writeAnswerFailure,
} from "../../reducers/support/csReducer";

// 관리자 목록
function* fetchCsPaged(action) {
  try {
    const { pageNo = 1, condition = "" } = action.payload || {};

    const { data } = yield call(() =>
      axios.get("/api/csBoard/cspaged", {
        params: {
          pstartno: pageNo,
          ...(condition ? { condition } : {}),
        },
      })
    );

    yield put(fetchCsPagedSuccess({ ...data, pageNo }));
  } catch (err) {
    yield put(fetchCsPagedFailure(err.response?.data?.message || err.message));
  }
}

// 관리자 검색
function* searchCs(action) {
  try {
    const { keyword = "", searchType = "", pageNo = 1, condition = "" } = action.payload || {};

    const { data } = yield call(() =>
      axios.get("/api/csBoard/cssearch", {
        params: {
          searchType,
          keyword,
          pstartno: pageNo,
          ...(condition ? { condition } : {}),
        },
      })
    );

    yield put(searchCsSuccess({ ...data, pageNo }));
  } catch (err) {
    yield put(searchCsFailure(err.response?.data?.message || err.message));
  }
}

// 답변 상태 토글 (PATCH)
// controller: PATCH /csBoard/{questionid}/active + body CSQuestionDto
function* quickAnswer(action) {
  try {
    const { questionid } = action.payload || {};
    if (!questionid) throw new Error("questionid 누락");

    const { data } = yield call(() =>
      axios.patch(`/api/csBoard/${questionid}/active`, { questionid })
    );
    const status =
      data?.status ??
      data?.dto?.status ??
      data?.question?.status ??
      data?.csQuestion?.status ??
      null;

    if (status !== null && status !== undefined) {
      yield put(quickAnswerSuccess({ questionid, status }));
      return;
    }

    const csState = yield select((state) => state.cs);
    if (csState?.mode === "search") {
      yield put(
        searchCsRequest({
          keyword: csState.keyword,
          searchType: csState.searchType,
          pageNo: csState.pageNo,
          condition: csState.condition,
        })
      );
    } else {
      yield put(
        fetchCsPagedRequest({
          pageNo: csState.pageNo,
          condition: csState.condition,
        })
      );
    }
    yield put(quickAnswerSuccess({ questionid }));
  } catch (err) {
    yield put(quickAnswerFailure(err.response?.data?.message || err.message));
  }
}

// 유저 내 1:1질문 목록
function* fetchMyCsList() {
  try {
    const { data } = yield call(() => axios.get("/api/csBoard/cslistuser"));
    yield put(fetchMyCsListSuccess(data));
  } catch (err) {
    yield put(fetchMyCsListFailure(err.response?.data?.message || err.message));
  }
}

// 카테고리
function* fetchCategories() {
  try {
    const { data } = yield call(() => axios.get("/api/csBoard/categories"));
    yield put(fetchCategoriesSuccess(data));
  } catch (err) {
    yield put(fetchCategoriesFailure(err.response?.data?.message || err.message));
  }
}

// 질문 작성
function* writeQuestion(action) {
  try {
    yield call(() => axios.post("/api/csBoard", action.payload));
    yield put(writeQuestionSuccess());
  } catch (err) {
    yield put(writeQuestionFailure(err.response?.data?.message || err.message));
  }
}

// 답변 작성
// controller: POST /csBoard/cs/{questionid}/answer + body CSAnswerDto
function* writeAnswer(action) {
  try {
    const { questionid, answercontent } = action.payload || {};
    if (!questionid) throw new Error("questionid 누락");

    const { data } = yield call(() =>
      axios.post(`/api/csBoard/cs/${questionid}/answer`, { answercontent })
    );

    // payload: { questionid, answer }
    // 서버가 answer 객체를 주면 그대로 넣고, 없으면 null
    const answer =
      data?.answer ??
      data?.dto ??
      data?.csAnswer ??
      data ??
      null;

    yield put(writeAnswerSuccess({ questionid, answer }));
  } catch (err) {
    yield put(writeAnswerFailure(err.response?.data?.message || err.message));
  }
}

export default function* csSaga() {
  yield takeLatest(fetchCsPagedRequest.type, fetchCsPaged);
  yield takeLatest(searchCsRequest.type, searchCs);

  yield takeLatest(quickAnswerRequest.type, quickAnswer);

  yield takeLatest(fetchMyCsListRequest.type, fetchMyCsList);
  yield takeLatest(fetchCategoriesRequest.type, fetchCategories);

  yield takeLatest(writeQuestionRequest.type, writeQuestion);
  yield takeLatest(writeAnswerRequest.type, writeAnswer);
}
