
import { call, put, takeLatest } from 'redux-saga/effects';
import axios from "../../api/axios";

import {
  fetchCommentsRequest, fetchCommentsSuccess, fetchCommentsFailure,
  createCommentRequest, createCommentSuccess, createCommentFailure,
  updateCommentRequest, updateCommentSuccess, updateCommentFailure,
  deleteCommentRequest, deleteCommentSuccess, deleteCommentFailure,
} from '../../reducers/exec/execCommentReducer';

// 공통에러출력
function getErrorMessage(err) {
  return err.response?.data?.message || err.message; 
}

// 댓글 조회
export function* fetchComments(action) {
  try {
    const { postId } = action.payload;
    const { data } = yield call(axios.get, `/api/exec/comments/post/${postId}`);
    yield put(fetchCommentsSuccess({ postId, comments: data })); 
  } catch (err) {
    yield put(fetchCommentsFailure(getErrorMessage(err)));
  }
}
// 댓글작성
export function* createComment(action) {
  try {
    const { postId, dto } = action.payload; 
    const { data } = yield call(axios.post, `/api/exec/comments`, { postId, ...dto });
    yield put(createCommentSuccess({ postId, comment: data }));
  } catch (err) {
    yield put(createCommentFailure(getErrorMessage(err)));
  }
}
// 댓글수정
export function* updateComment(action) {
  try {
    const { postId, commentId, dto } = action.payload;
    const { data } = yield call(axios.patch, `/api/exec/comments/${commentId}`, dto); 
    yield put(updateCommentSuccess({ postId, comment: data })); 
  } catch (err) {
    yield put(updateCommentFailure(getErrorMessage(err)));
  }
}
// 댓글삭제
export function* deleteComment(action) {
  try {
    const { postId, commentId } = action.payload;
    yield call(axios.delete, `/api/exec/comments/${commentId}`);
    yield put(
      deleteCommentSuccess({ postId, commentId })); 
  } catch (err) {
    yield put(deleteCommentFailure(getErrorMessage(err)));
  }
}

export default function* commentSaga() {
  yield takeLatest(fetchCommentsRequest.type, fetchComments);
  yield takeLatest(createCommentRequest.type, createComment);
  yield takeLatest(updateCommentRequest.type, updateComment);
  yield takeLatest(deleteCommentRequest.type, deleteComment);
}
