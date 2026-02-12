// __tests__/adSaga.test.js

import { runSaga } from 'redux-saga';
import api from '../../api/axios';
import {
  fetchAdRequest, fetchAdSuccess, fetchAdFailure,
  createAdRequest, createAdSuccess, createAdFailure,
  updateAdRequest, updateAdSuccess, updateAdFailure,
  deleteAdRequest, deleteAdSuccess, deleteAdFailure,
  fetchLatestAdsRequest, fetchLatestAdsSuccess, fetchLatestAdsFailure, // ✅ 최신 광고 액션 추가
} from "../../reducers/ad/adReducer";
import { fetchAd, createAd, updateAd, deleteAd, fetchLatestAds } from './adSaga'; // ✅ fetchLatestAds 추가

// axios 모킹
jest.mock('../../api/axios');

describe('adSaga 테스트', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- 광고 단건 조회 ---
  it('fetchAd 성공 시 fetchAdSuccess를 디스패치해야 한다', async () => {    
    const mockData = { id: 1, title: '테스트 광고' };
    api.get.mockResolvedValue({ data: mockData });  
    const dispatched = [];

    const action = fetchAdRequest({ adId: 1 });
    await runSaga({ dispatch: (a) => dispatched.push(a) }, fetchAd, action).toPromise();
    
    expect(dispatched).toContainEqual(fetchAdSuccess(mockData));
    // ✅ URL 보완 확인
    expect(api.get).toHaveBeenCalledWith('/api/ads/1');
  });

  it('fetchAd 실패 시 fetchAdFailure를 디스패치해야 한다', async () => {
    api.get.mockRejectedValue({ response: { data: { message: '조회 실패' } } });
    const dispatched = [];

    const action = fetchAdRequest({ adId: 1 });
    await runSaga({ dispatch: (a) => dispatched.push(a) }, fetchAd, action).toPromise();

    expect(dispatched).toContainEqual(fetchAdFailure('조회 실패'));
  });

  // --- 광고 생성 ---
  it('createAd 성공 시 createAdSuccess를 디스패치해야 한다', async () => {
    const mockResponse = { id: 10, title: '새 광고' };
    api.post.mockResolvedValue({ data: mockResponse });
    const dispatched = [];

    const action = createAdRequest({ dto: { title: '새 광고' }, file: null });
    await runSaga({ dispatch: (a) => dispatched.push(a) }, createAd, action).toPromise();

    expect(dispatched).toContainEqual(createAdSuccess(mockResponse));
    // ✅ URL 보완 확인
    expect(api.post).toHaveBeenCalledWith('/api/ads', expect.any(FormData));
  });

  it('createAd 실패 시 createAdFailure를 디스패치해야 한다', async () => {
    api.post.mockRejectedValue(new Error('네트워크 에러'));
    const dispatched = [];

    const action = createAdRequest({ dto: {}, file: null });
    await runSaga({ dispatch: (a) => dispatched.push(a) }, createAd, action).toPromise();

    expect(dispatched).toContainEqual(createAdFailure('네트워크 에러'));
  });

  // --- 광고 수정 ---
  it('updateAd 성공 시 updateAdSuccess를 디스패치해야 한다', async () => {
    const mockResponse = { id: 1, title: '수정된 광고' };
    api.put.mockResolvedValue({ data: mockResponse });
    const dispatched = [];

    const action = updateAdRequest({ adId: 1, dto: { title: '수정된 광고' }, file: null });
    await runSaga({ dispatch: (a) => dispatched.push(a) }, updateAd, action).toPromise();

    expect(dispatched).toContainEqual(updateAdSuccess(mockResponse));
    // ✅ URL 보완 확인
    expect(api.put).toHaveBeenCalledWith('/api/ads/1', expect.any(FormData));
  });

  it('updateAd 실패 시 updateAdFailure를 디스패치해야 한다', async () => {
    api.put.mockRejectedValue({ response: { data: { message: '수정 실패' } } });
    const dispatched = [];

    const action = updateAdRequest({ adId: 1, dto: {}, file: null });
    await runSaga({ dispatch: (a) => dispatched.push(a) }, updateAd, action).toPromise();

    expect(dispatched).toContainEqual(updateAdFailure('수정 실패'));
  });

  // --- 광고 삭제 ---
  it('deleteAd 성공 시 deleteAdSuccess를 디스패치해야 한다', async () => {
    api.delete.mockResolvedValue({});
    const dispatched = [];

    const action = deleteAdRequest({ adId: 1 });
    await runSaga({ dispatch: (a) => dispatched.push(a) }, deleteAd, action).toPromise();

    expect(dispatched).toContainEqual(deleteAdSuccess(1));
    // ✅ URL 보완 확인
    expect(api.delete).toHaveBeenCalledWith('/api/ads/1');
  });

  it('deleteAd 실패 시 deleteAdFailure를 디스패치해야 한다', async () => {
    api.delete.mockRejectedValue({ response: { data: { message: '삭제 권한 없음' } } });
    const dispatched = [];

    const action = deleteAdRequest({ adId: 1 });
    await runSaga({ dispatch: (a) => dispatched.push(a) }, deleteAd, action).toPromise();

    expect(dispatched).toContainEqual(deleteAdFailure('삭제 권한 없음'));
  });

  // --- ✅ 최신 광고 페이징 조회 ---
  it('fetchLatestAds 성공 시 fetchLatestAdsSuccess를 디스패치해야 한다', async () => {
    const mockAds = [{ id: 1, title: '최신 광고' }];
    api.get.mockResolvedValue({ data: mockAds });
    const dispatched = [];

    const action = fetchLatestAdsRequest({ start: 1, end: 10 });
    await runSaga({ dispatch: (a) => dispatched.push(a) }, fetchLatestAds, action).toPromise();

    expect(dispatched).toContainEqual(fetchLatestAdsSuccess(mockAds));
    expect(api.get).toHaveBeenCalledWith('/api/ads/latest?start=1&end=10');
  });

  it('fetchLatestAds 실패 시 fetchLatestAdsFailure를 디스패치해야 한다', async () => {
    api.get.mockRejectedValue({ response: { data: { message: '조회 실패' } } });
    const dispatched = [];

    const action = fetchLatestAdsRequest({ start: 1, end: 10 });
    await runSaga({ dispatch: (a) => dispatched.push(a) }, fetchLatestAds, action).toPromise();

    expect(dispatched).toContainEqual(fetchLatestAdsFailure('조회 실패'));
  });
});
