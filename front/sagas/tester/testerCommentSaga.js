// sagas/tester/testerCommentSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "../../api/axios";

import {
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
} from "../../reducers/tester/testerCommentReducer";

/**
 * API 정리
 * - GET    /api/tester/comments/{testerid}
 * - POST   /api/tester/comments
 * - PATCH  /api/tester/comments/{testercommentid}
 * - DELETE /api/tester/comments/{testercommentid}
 */

// 댓글 목록 조회
// payload: { testerid }
function* fetchTesterCommentListSaga(action) {
  try {
    const { testerid } = action.payload || {};
    if (!testerid) throw new Error("testerid 누락");

    const { data } = yield call(() =>
      axios.get(`/api/tester/comments/${testerid}`)
    );

    yield put(fetchTesterCommentListSuccess(data));
  } catch (err) {
    yield put(
      fetchTesterCommentListFailure(err.response?.data?.message || err.message)
    );
  }
}

// 댓글 작성
// payload: { testerid, content }
function* createTesterCommentSaga(action) {
  try {
    const { testerid, content } = action.payload || {};
    if (!testerid) throw new Error("testerid 누락");
    if (!content) throw new Error("content 누락");

    const { data } = yield call(() =>
      axios.post("/api/tester/comments", { testerid, content })
    );

    yield put(createTesterCommentSuccess(data));
    yield put(resetTesterCommentWriteUpdateState());

    // 새로고침
    yield put(fetchTesterCommentListRequest({ testerid }));
  } catch (err) {
    yield put(
      createTesterCommentFailure(err.response?.data?.message || err.message)
    );
  }
}

// 댓글 수정
// payload: { testerid, testercommentid, content }
function* updateTesterCommentSaga(action) {
  try {
    const { testerid, testercommentid, content } = action.payload || {};
    if (!testerid) throw new Error("testerid 누락");
    if (!testercommentid) throw new Error("testercommentid 누락");
    if (!content) throw new Error("content 누락");

    const { data } = yield call(() =>
      axios.patch(`/api/tester/comments/${testercommentid}`, { content })
    );

    yield put(updateTesterCommentSuccess(data));
    yield put(resetTesterCommentWriteUpdateState());

    // 새로고침
    yield put(fetchTesterCommentListRequest({ testerid }));
  } catch (err) {
    yield put(
      updateTesterCommentFailure(err.response?.data?.message || err.message)
    );
  }
}

// 댓글 삭제
// payload: { testerid, testercommentid }
function* deleteTesterCommentSaga(action) {
  try {
    const { testerid, testercommentid } = action.payload || {};
    if (!testerid) throw new Error("testerid 누락");
    if (!testercommentid) throw new Error("testercommentid 누락");

    const { data } = yield call(() =>
      axios.delete(`/api/tester/comments/${testercommentid}`)
    );

    if (Number(data) === 1) {
      yield put(deleteTesterCommentSuccess(testercommentid));
      yield put(resetTesterCommentWriteUpdateState());

      // 새로고침
      yield put(fetchTesterCommentListRequest({ testerid }));
    } else {
      throw new Error("댓글 삭제 실패");
    }
  } catch (err) {
    yield put(
      deleteTesterCommentFailure(err.response?.data?.message || err.message)
    );
  }
}

export default function* testerCommentSaga() {
  yield takeLatest(fetchTesterCommentListRequest.type, fetchTesterCommentListSaga);

  yield takeLatest(createTesterCommentRequest.type, createTesterCommentSaga);
  yield takeLatest(updateTesterCommentRequest.type, updateTesterCommentSaga);
  yield takeLatest(deleteTesterCommentRequest.type, deleteTesterCommentSaga);
}