// __tests__/adSaga.test.js

import { runSaga } from 'redux-saga';
import api from '../../api/axios';
import {
  fetchAdRequest, fetchAdSuccess, fetchAdFailure,
  createAdRequest, createAdSuccess, createAdFailure,
  updateAdRequest, updateAdSuccess, updateAdFailure,
  deleteAdRequest, deleteAdSuccess, deleteAdFailure,
} from "../../reducers/ad/adReducer";
import adSaga, { fetchAd, createAd, updateAd, deleteAd } from './adSaga';

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
    // ✅ URL 수정: '/ads/ads' → '/ads'
    expect(api.post).toHaveBeenCalledWith('/ads', expect.any(FormData), {
      headers: { "Content-Type": "multipart/form-data" }
    });
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
    // ✅ URL 수정: '/ads/1/ads' → '/ads/1'
    expect(api.put).toHaveBeenCalledWith('/ads/1', expect.any(FormData), {
      headers: { "Content-Type": "multipart/form-data" }
    });
  });

  // --- 광고 삭제 ---
  it('deleteAd 성공 시 deleteAdSuccess를 디스패치해야 한다', async () => {
    api.delete.mockResolvedValue({});
    const dispatched = [];

    const action = deleteAdRequest({ adId: 1 });
    await runSaga({ dispatch: (a) => dispatched.push(a) }, deleteAd, action).toPromise();

    expect(dispatched).toContainEqual(deleteAdSuccess(1));
    expect(api.delete).toHaveBeenCalledWith('/ads/1');
  });

  it('deleteAd 실패 시 deleteAdFailure를 디스패치해야 한다', async () => {
    api.delete.mockRejectedValue({ response: { data: { message: '삭제 권한 없음' } } });
    const dispatched = [];

    const action = deleteAdRequest({ adId: 1 });
    await runSaga({ dispatch: (a) => dispatched.push(a) }, deleteAd, action).toPromise();

    expect(dispatched).toContainEqual(deleteAdFailure('삭제 권한 없음'));
  });
});