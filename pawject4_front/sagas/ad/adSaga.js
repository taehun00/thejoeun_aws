// sagas/adSaga.js

import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../api/axios';
import {
  fetchAdRequest, fetchAdSuccess, fetchAdFailure,
  createAdRequest, createAdSuccess, createAdFailure,
  updateAdRequest, updateAdSuccess, updateAdFailure,
  deleteAdRequest, deleteAdSuccess, deleteAdFailure,
  //fetchActiveAdsSuccess, fetchActiveAdsFailure, fetchActiveAdsRequest
} from "../../reducers/ad/adReducer";

// 광고 단건 조회 Saga
export function* fetchAd(action) {
  try {
    const { adId } = action.payload;
    const response = yield call(api.get, `/ads/${adId}`); // ✅ Controller: GET /ads/{adId}
    yield put(fetchAdSuccess(response.data));
  } catch (e) {
    yield put(fetchAdFailure(e.response?.data?.message || e.message));
  }
}

// 광고 등록 Saga
export function* createAd(action) {
  try {
    const { dto, file } = action.payload;
    const formData = new FormData();

    // ✅ DTO 필드별 append (Spring @ModelAttribute 매핑)
    Object.entries(dto).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (file) formData.append('file', file);

    // ✅ URL 수정: POST /ads
    const response = yield call(api.post, '/ads', formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    yield put(createAdSuccess(response.data));
  } catch (e) {
    yield put(createAdFailure(e.response?.data?.message || e.message));
  }
}

// 광고 수정 Saga
export function* updateAd(action) {
  try {
    const { adId, dto, file } = action.payload;
    const formData = new FormData();

    // ✅ DTO 필드별 append
    Object.entries(dto).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (file) formData.append('file', file);

    // ✅ URL 수정: PUT /ads/{adId}
    const response = yield call(api.put, `/ads/${adId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    yield put(updateAdSuccess(response.data));
  } catch (e) {
    yield put(updateAdFailure(e.response?.data?.message || e.message));
  }
}

// 광고 삭제 Saga
export function* deleteAd(action) {
  try {
    const { adId } = action.payload;
    yield call(api.delete, `/ads/${adId}`); // ✅ Controller: DELETE /ads/{adId}
    yield put(deleteAdSuccess(adId));
  } catch (e) {
    yield put(deleteAdFailure(e.response?.data?.message || e.message));
  }
}

// 활성 광고 조회 비동기 처리
// export function* fetchActiveAdsSaga() {
//   try {
//     // 백엔드 엔드포인트: GET /ads/active (이전에 추가한 API)
//     const response = yield call(api.get, '/ads/active'); 
//     yield put(fetchActiveAdsSuccess(response.data));
//   } catch (e) {
//     yield put(fetchActiveAdsFailure(e.response?.data?.message || e.message));
//   }
// }



// Saga watcher
export default function* adSaga() {
  yield takeLatest(fetchAdRequest.type, fetchAd);
  yield takeLatest(createAdRequest.type, createAd);
  yield takeLatest(updateAdRequest.type, updateAd);
  yield takeLatest(deleteAdRequest.type, deleteAd);
  // fetchActiveAdsRequest 액션이 들어오면 fetchActiveAdsSaga 실행
 // yield takeLatest(fetchActiveAdsRequest.type, fetchActiveAdsSaga);
}