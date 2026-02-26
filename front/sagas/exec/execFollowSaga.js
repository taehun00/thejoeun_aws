
import { call, put, takeLatest, all, select } from "redux-saga/effects";
import axios from "../../api/axios";
import { message } from "antd";
import {
  followRequest, followSuccess, followFailure,
  unfollowRequest, unfollowSuccess, unfollowFailure,
  loadFollowersRequest, loadFollowersSuccess, loadFollowersFailure,
  loadFollowingsRequest, loadFollowingsSuccess, loadFollowingsFailure,

  toggleFollowRequest,
} from "../../reducers/exec/execFollowReducer";

// 팔로우 추가
function followApi({ followeeId }) {
  return axios.post("/api/exec/follows", { followeeId });
}

export function* follow(action) {
  try {
    const { data } = yield call(followApi, action.payload);
    yield put(followSuccess({
      followeeId: String(data.followeeId ?? data.userId),
      blocked: data.blocked ?? false,
    }));
    yield put(loadFollowingsRequest()); // 서버와 동기화
  } catch (err) {
    message.error("팔로우 요청에 실패했습니다.");
    yield put(followFailure(err.response?.data || err.message));
  }
}

// 언 팔로우  
function unfollowApi({ followeeId }) {
  return axios.delete("/api/exec/follows", {
    data: { followeeId }
  });
}
export function* unfollow(action) {
  try {
    const { data } = yield call(unfollowApi, action.payload);
    yield put(unfollowSuccess(String(data.followeeId ?? data.userId)));
    yield put(loadFollowingsRequest()); // 서버와 동기화
  } catch (err) {
    message.error("언팔로우 요청에 실패했습니다.");
    yield put(unfollowFailure(err.response?.data || err.message));
  }
}

// 팔로워 목록
function followersApi() {
  return axios.get("/api/exec/follows/me/followers");
}

export function* loadFollowers() {
  try {
    const { data } = yield call(followersApi);
    yield put(loadFollowersSuccess(data));
  } catch (err) {
    message.error("팔로워 목록 불러오기 실패");
    yield put(loadFollowersFailure(err.response?.data || err.message));
  }
}

// 팔로잉 목록
function followingsApi() {
  return axios.get("/api/exec/follows/me/followings");
}
export function* loadFollowings() {
  try {
    const { data } = yield call(followingsApi);
    yield put(loadFollowingsSuccess(data));
  } catch (err) {
    message.error("팔로잉 목록 불러오기 실패");
    yield put(loadFollowingsFailure(err.response?.data || err.message));
  }
}



export function* toggleFollow(action) {
  try {
    const followeeId = String(action.payload.followeeId);
    const isFollowing = yield select(
      (state) => state.execFollow.followingsMap?.[followeeId]
    );

    if (isFollowing) {
      yield put(unfollowSuccess(followeeId));
      try {
        yield call(unfollowApi, { followeeId });
        yield put(loadFollowingsRequest());
      } catch (err) {
        yield put(followSuccess({ followeeId, blocked: false }));
        message.error("언팔로우 요청 실패, 상태를 되돌렸습니다.");
      }
    } else {
      yield put(followSuccess({ followeeId, blocked: false }));
      try {
        yield call(followApi, { followeeId });
        yield put(loadFollowingsRequest());
      } catch (err) {
        yield put(unfollowSuccess(followeeId));
        message.error("팔로우 요청 실패, 상태를 되돌렸습니다.");
      }
    }
  } catch (err) {
    message.error("팔로우 토글 처리 중 오류가 발생했습니다.");
  }
}

// --- Root Saga ---
export default function* followSaga() {
  yield all([
    takeLatest(followRequest.type, follow),
    takeLatest(unfollowRequest.type, unfollow),
    takeLatest(loadFollowersRequest.type, loadFollowers),
    takeLatest(loadFollowingsRequest.type, loadFollowings), 
    takeLatest(toggleFollowRequest.type, toggleFollow),
  ]);
}
