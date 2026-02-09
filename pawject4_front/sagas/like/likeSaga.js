import { call, put, takeLatest } from "redux-saga/effects";
import { message } from "antd";
import api from "../../api/axios";
import {
  likeReviewRequest, likeReviewSuccess, likeReviewFailure,
  likeTesterRequest, likeTesterSuccess, likeTesterFailure,
  removeLikeReviewRequest, removeLikeReviewSuccess, removeLikeReviewFailure,
  removeLikeTesterRequest, removeLikeTesterSuccess, removeLikeTesterFailure,
  countLikesReviewRequest, countLikesReviewSuccess, countLikesReviewFailure,
  checkLikeReviewMeRequest, checkLikeReviewMeSuccess, checkLikeReviewMeFailure,
  countLikesTesterRequest, countLikesTesterSuccess, countLikesTesterFailure,
} from "../../reducers/like/likeReducer";

/* =========================
   API 호출
========================= */
function likeReviewApi(payload) {
  return api.post("/api/likes", payload);
}

function likeTesterApi(payload) {
  return api.post("/api/likes", payload);
}

function removeLikeReviewApi(reviewId) {
  return api.delete(`/api/likes/review/${reviewId}`);
}

function removeLikeTesterApi(testerId) {
  return api.delete(`/api/likes/tester/${testerId}`);
}

function countLikesReviewApi(reviewId) {
  return api.get(`/api/likes/review/count/${reviewId}`);
}

function checkLikeReviewMeApi(reviewId) {
  return api.get(`/api/likes/review/${reviewId}/me`);
}

function countLikesTesterApi(testerId) {
  return api.get(`/api/likes/tester/count/${testerId}`);
}

/* =========================
   Saga
========================= */
// 좋아요 클릭
export function* likeReview(action) {
  try {
    const { data } = yield call(likeReviewApi, action.payload);
    yield put(likeReviewSuccess({ reviewId: data.reviewId, count: data.count }));
    message.success("리뷰 좋아요 완료");
  } catch (err) {
    yield put(likeReviewFailure(err.response?.data?.error || err.message));
    message.error("리뷰 좋아요 실패");
  }
}

export function* likeTester(action) {
  try {
    const { data } = yield call(likeTesterApi, action.payload);
    yield put(likeTesterSuccess({ testerId: data.testerId, count: data.count }));
    message.success("체험단 좋아요 완료");
  } catch (err) {
    yield put(likeTesterFailure(err.response?.data?.error || err.message));
    message.error("체험단 좋아요 실패");
  }
}

// 좋아요 취소 클릭
export function* removeLikeReview(action) {
  try {
    const { data } = yield call(removeLikeReviewApi, action.payload.reviewId);
    yield put(removeLikeReviewSuccess({ reviewId: data.reviewId, count: data.count }));
    message.success("리뷰 좋아요 취소 완료");
  } catch (err) {
    yield put(removeLikeReviewFailure(err.response?.data?.error || err.message));
    message.error("리뷰 좋아요 취소 실패");
  }
}

export function* removeLikeTester(action) {
  try {
    const { data } = yield call(removeLikeTesterApi, action.payload.testerId);
    yield put(removeLikeTesterSuccess({ testerId: data.testerId, count: data.count }));
    message.success("체험단 좋아요 취소 완료");
  } catch (err) {
    yield put(removeLikeTesterFailure(err.response?.data?.error || err.message));
    message.error("체험단 좋아요 취소 실패");
  }
}

// 좋아요 수 조회
export function* countLikesReview(action) {
  try {
    const { data } = yield call(countLikesReviewApi, action.payload.reviewId);
    yield put(countLikesReviewSuccess({ reviewId: data.reviewId, count: data.count }));
  } catch (err) {
    yield put(countLikesReviewFailure(err.response?.data?.error || err.message));
  }
}

export function* checkLikeReviewMe(action) {
  try {
    const { data } = yield call(checkLikeReviewMeApi, action.payload.reviewId);

    // data = true / false
    yield put(checkLikeReviewMeSuccess({
      reviewId: action.payload.reviewId,
      liked: data,
    }));
  } catch (err) {
    yield put(checkLikeReviewMeFailure(err.response?.data?.error || err.message));
  }
}


export function* countLikesTester(action) {
  try {
    const { data } = yield call(countLikesTesterApi, action.payload.testerId);
    yield put(countLikesTesterSuccess({ testerId: data.testerId, count: data.count }));
  } catch (err) {
    yield put(countLikesTesterFailure(err.response?.data?.error || err.message));
  }
}

/* =========================
   Root Saga
========================= */
export default function* likesSaga() {
  yield takeLatest(likeReviewRequest.type, likeReview);
  yield takeLatest(likeTesterRequest.type, likeTester);
  yield takeLatest(removeLikeReviewRequest.type, removeLikeReview);
  yield takeLatest(removeLikeTesterRequest.type, removeLikeTester);
  yield takeLatest(countLikesReviewRequest.type, countLikesReview);
  yield takeLatest(checkLikeReviewMeRequest.type, checkLikeReviewMe);
  yield takeLatest(countLikesTesterRequest.type, countLikesTester);
}
