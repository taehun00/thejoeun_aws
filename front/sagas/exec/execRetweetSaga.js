import { call, put, takeLatest } from 'redux-saga/effects';
import axios from "../../api/axios";
import {
  addRetweetRequest, addRetweetSuccess, addRetweetFailure,
  removeRetweetRequest, removeRetweetSuccess, removeRetweetFailure,
  hasRetweetedRequest, hasRetweetedSuccess, hasRetweetedFailure,
  fetchMyRetweetsRequest, fetchMyRetweetsSuccess, fetchMyRetweetsFailure,
} from '../../reducers/exec/execRetweetReducer';

//  리트윗 추가
export function* addRetweet(action) {
  try {
    const { postId } = action.payload;  // react 에서 던지는값
    const { data } = yield call(() => axios.post(`/api/exec/retweets`, { originalPostId: postId }));
    yield put(addRetweetSuccess({ postId: data.originalPostId, retweetCount: data.retweetCount })); 
  } catch (err) {
    yield put(addRetweetFailure(err.response?.data?.message || err.message));
  }
}

//  리트윗 여부 확인
export function* hasRetweeted(action) {
  try {
    const { postId } = action.payload;
    const { data } = yield call(() => axios.get(`/api/exec/retweets/${postId}`));
    yield put(hasRetweetedSuccess({ postId, hasRetweeted: data }));
  } catch (err) {
    yield put(hasRetweetedFailure(err.response?.data?.message || err.message));
  }
}

// 리트윗삭제
export function* removeRetweet(action) {
  try {
    const { postId } = action.payload;
    const { data } = yield call(() => axios.delete(`/api/exec/retweets/${postId}`));
    yield put(removeRetweetSuccess({ postId, retweetCount: data.retweetCount })); 
  } catch (err) {
    yield put(removeRetweetFailure(err.response?.data?.message || err.message));
  }
}
// 내가 리트윗한 글 목록
export function* fetchMyRetweets(action) {
  try {
    const { userId } = action.payload;
    const { data } = yield call(() => axios.get(`/api/exec/retweets/user/${userId}`)); 
    // 서버에서 [1,2,3,...] 형태로 반환 → {1:true, 2:true,...} 변환
    const retweetedPosts = {};
    data.forEach(postId => { retweetedPosts[postId] = true; });
    yield put(fetchMyRetweetsSuccess(retweetedPosts));
  } catch (err) {
    yield put(fetchMyRetweetsFailure(err.response?.data?.message || err.message));
  }
}

export default function* retweetSaga() {
  yield takeLatest(addRetweetRequest.type, addRetweet);
  yield takeLatest(hasRetweetedRequest.type, hasRetweeted);
  yield takeLatest(removeRetweetRequest.type, removeRetweet);
  yield takeLatest(fetchMyRetweetsRequest.type, fetchMyRetweets);
}
