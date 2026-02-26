import { call, put, takeLatest } from 'redux-saga/effects';
import axios from "../../api/axios";

import {
  fetchPostsRequest, fetchPostsSuccess, fetchPostsFailure,
  fetchPostRequest, fetchPostSuccess, fetchPostFailure,
  fetchPostsPagedRequest, fetchPostsPagedSuccess, fetchPostsPagedFailure,
  fetchLikedPostsRequest, fetchLikedPostsSuccess, fetchLikedPostsFailure,
  fetchMyAndRetweetsRequest, fetchMyAndRetweetsSuccess, fetchMyAndRetweetsFailure, 
  createPostRequest, createPostSuccess, createPostFailure,
  updatePostRequest, updatePostSuccess, updatePostFailure,
  deletePostRequest, deletePostSuccess, deletePostFailure,
} from '../../reducers/exec/execPostReducer';

// 전체게시글
export function* fetchPosts() {
  try {                               //localhost:8484/api/posts
    const { data } = yield call(() => axios.get('/api/exec/posts'));
    yield put(fetchPostsSuccess(data));
  } catch (err) {
    yield put(fetchPostsFailure(err.response?.data?.message || err.message));
  }
}

// 단건게시글
export function* fetchPost(action) {
  try {
    const { data } = yield call(() => axios.get(`/api/exec/posts/${action.payload.postId}`));
    yield put(fetchPostSuccess(data));
  } catch (err) {
    yield put(fetchPostFailure(err.response?.data?.message || err.message));
  }
}

// 전체게시글 페이징조회
export function* fetchPostsPaged(action) {
  try {
    const { page, size } = action.payload;
    const { data } = yield call(() => axios.get(`/api/exec/posts/paged?page=${page}&size=${size}`));
    yield put(fetchPostsPagedSuccess(data)); // ✅ 변경: 중복 제거는 리듀서에서 처리
  } catch (err) {
    yield put(fetchPostsPagedFailure(err.response?.data?.message || err.message));
  }
}

// 좋아요한 게시글
export function* fetchLikedPosts(action) {
  try {
    const { page, size } = action.payload;
    const { data } = yield call(() => axios.get(`/api/exec/posts/liked?page=${page}&size=${size}`));
    yield put(fetchLikedPostsSuccess(data));
  } catch (err) {
    yield put(fetchLikedPostsFailure(err.response?.data?.message || err.message));
  }
}
// 내가 쓴글 + 리트윗한 글
export function* fetchMyAndRetweets(action) { // ✅ 변경
  try {
    const { page, size } = action.payload;
    const { data } = yield call(() =>
      axios.get(`/api/exec/posts/myPostRetweets/paged?page=${page}&size=${size}`) // ✅ 변경: 컨트롤러 엔드포인트와 일치
    );
    yield put(fetchMyAndRetweetsSuccess(data));
  } catch (err) {
    yield put(fetchMyAndRetweetsFailure(err.response?.data?.message || err.message));
  }
}
// 글쓰기
export function* createPost(action) {
  try {
    const { dto, files } = action.payload;
    const formData = new FormData();
    Object.entries(dto || {}).forEach(([k, v]) => formData.append(k, v));
    (files || []).forEach(f => formData.append('files', f));

    const { data } = yield call(() =>
      axios.post('/api/exec/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
    yield put(createPostSuccess(data));
  } catch (err) {
    yield put(createPostFailure(err.response?.data?.message || err.message));
  }
}
// 수정
export function* updatePost(action) {
  try {
    const { postId, dto, files } = action.payload;
    const formData = new FormData();
    Object.entries(dto || {}).forEach(([k, v]) => formData.append(k, v));

    // ✅ 변경: files가 있을 때만 추가
    if (files && files.length > 0) {
      files.forEach(f => formData.append('files', f));
    }

    const { data } = yield call(() =>
      axios.put(`/api/exec/posts/${postId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
    yield put(updatePostSuccess(data));
  } catch (err) {
    yield put(updatePostFailure(err.response?.data?.message || err.message));
  }
}
// 삭제
export function* deletePost(action) {
  try {
    yield call(() => axios.delete(`/api/exec/posts/${action.payload.postId}`));
    yield put(deletePostSuccess(action.payload.postId)); // ✅ 변경: postId만 전달
  } catch (err) {
    yield put(deletePostFailure(err.response?.data?.message || err.message));
  }
}


export default function* postSaga() {
  yield takeLatest(fetchPostsRequest.type, fetchPosts);
  yield takeLatest(fetchPostRequest.type, fetchPost);
  yield takeLatest(fetchPostsPagedRequest.type, fetchPostsPaged);
  yield takeLatest(fetchLikedPostsRequest.type, fetchLikedPosts);
  yield takeLatest(fetchMyAndRetweetsRequest.type, fetchMyAndRetweets); // ✅ 변경
  yield takeLatest(createPostRequest.type, createPost);
  yield takeLatest(updatePostRequest.type, updatePost);
  yield takeLatest(deletePostRequest.type, deletePost);
}
