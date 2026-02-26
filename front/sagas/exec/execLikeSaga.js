import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../api/axios";
import {
  addLikeRequest, addLikeSuccess, addLikeFailure,
  removeLikeRequest, removeLikeSuccess, removeLikeFailure,
  countLikesRequest, countLikesSuccess, countLikesFailure,
  fetchMyLikesRequest, fetchMyLikesSuccess, fetchMyLikesFailure,
} from "../../reducers/exec/execLikeReducer";

function getErrorMessage(err) {
  return err?.response?.data?.message || err.message || "Unknown error";
}

const addLikeApi = (postId) => api.post("/api/exec/likes", { postId });

export function* addLikeSaga(action) {
  try {
    const { postId } = action.payload;
    const { data } = yield call(addLikeApi, postId);
    yield put(addLikeSuccess({ postId: data.postId, count: data.count }));
  } catch (err) {
    yield put(addLikeFailure(getErrorMessage(err)));
  }
}

const removeLikeApi = (postId) => api.delete(`/api/exec/likes/${postId}`);

export function* removeLikeSaga(action) {
  try {
    const { postId } = action.payload;
    const { data } = yield call(removeLikeApi, postId);
    yield put(removeLikeSuccess({ postId: data.postId, count: data.count }));
  } catch (err) {
    yield put(removeLikeFailure(getErrorMessage(err)));
  }
}

const countLikesApi = (postId) => api.get(`/api/exec/likes/count/${postId}`);

export function* countLikesSaga(action) {
  try {
    const { postId } = action.payload;
    const { data } = yield call(countLikesApi, postId);
    yield put(countLikesSuccess({ postId: data.postId, count: data.count }));
  } catch (err) {
    yield put(countLikesFailure(getErrorMessage(err)));
  }
}

const fetchMyLikesApi = (userId) =>
  api.get(`/api/exec/posts/liked/${userId}`);

export function* fetchMyLikesSaga(action) {
  try {
    const { userId } = action.payload;
    const { data } = yield call(fetchMyLikesApi, userId);
    yield put(fetchMyLikesSuccess(data));
  } catch (err) {
    yield put(fetchMyLikesFailure(getErrorMessage(err)));
  }
}

export default function* likeSaga() {
  yield takeLatest(addLikeRequest.type, addLikeSaga);
  yield takeLatest(removeLikeRequest.type, removeLikeSaga);
  yield takeLatest(countLikesRequest.type, countLikesSaga);
  yield takeLatest(fetchMyLikesRequest.type, fetchMyLikesSaga);
}
