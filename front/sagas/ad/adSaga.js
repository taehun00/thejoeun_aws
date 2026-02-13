// sagas/adSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../api/axios';
import {
  fetchAdRequest, fetchAdSuccess, fetchAdFailure,
  createAdRequest, createAdSuccess, createAdFailure,
  updateAdRequest, updateAdSuccess, updateAdFailure,
  deleteAdRequest, deleteAdSuccess, deleteAdFailure,
  fetchLatestAdsRequest, fetchLatestAdsSuccess, fetchLatestAdsFailure,
} from "../../reducers/ad/adReducer";

// 광고 단건 조회
export function* fetchAd(action) {   // ✅ export 추가
  try {
    const { adId } = action.payload;
    const response = yield call(api.get, `/api/ads/${adId}`); // ✅ URL 보완
    yield put(fetchAdSuccess(response.data));
  } catch (e) {
    yield put(fetchAdFailure(e.response?.data?.message || e.message));
  }
}

// 광고 등록
export function* createAd(action) {  // ✅ export 추가
  try {
    const { dto, file } = action.payload;
    const formData = new FormData();
    Object.entries(dto).forEach(([key, value]) => formData.append(key, value));
    if (file) formData.append('file', file);

    // ✅ Axios 인터셉터가 JWT/Content-Type 자동 처리
    const response = yield call(api.post, '/api/ads', formData);
    yield put(createAdSuccess(response.data));
  } catch (e) {
    yield put(createAdFailure(e.response?.data?.message || e.message));
  }
}

// 광고 수정
export function* updateAd(action) {  // ✅ export 추가
  try {
    const { adId, dto, file } = action.payload;
    const formData = new FormData();
    Object.entries(dto).forEach(([key, value]) => formData.append(key, value));
    if (file) formData.append('file', file);

    const response = yield call(api.put, `/api/ads/${adId}`, formData); // ✅ URL 보완
    yield put(updateAdSuccess(response.data));
  } catch (e) {
    yield put(updateAdFailure(e.response?.data?.message || e.message));
  }
}

// 광고 삭제
export function* deleteAd(action) {  // ✅ export 추가
  try {
    const { adId } = action.payload;
    yield call(api.delete, `/api/ads/${adId}`); // ✅ URL 보완
    yield put(deleteAdSuccess(adId));
  } catch (e) {
    yield put(deleteAdFailure(e.response?.data?.message || e.message));
  }
}

// 최신 광고 페이징 조회
export function* fetchLatestAds(action) {  // ✅ export 추가
  try {
    const { start = 1, end = 10 } = action.payload || {};
    const response = yield call(api.get, `/api/ads/latest?start=${start}&end=${end}`);
    yield put(fetchLatestAdsSuccess(response.data));
  } catch (e) {
    yield put(fetchLatestAdsFailure(e.response?.data?.message || e.message));
  }
}

// Saga watcher
export default function* adSaga() {
  yield takeLatest(fetchAdRequest.type, fetchAd);
  yield takeLatest(createAdRequest.type, createAd);
  yield takeLatest(updateAdRequest.type, updateAd);
  yield takeLatest(deleteAdRequest.type, deleteAd);
  yield takeLatest(fetchLatestAdsRequest.type, fetchLatestAds);
}
