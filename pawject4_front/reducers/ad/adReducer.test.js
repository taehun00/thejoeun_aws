// reducers/adReducer.js
import reducer, {
  fetchAdRequest, fetchAdSuccess, fetchAdFailure,
  createAdRequest, createAdSuccess, createAdFailure,
  updateAdRequest, updateAdSuccess, updateAdFailure,
  deleteAdRequest, deleteAdSuccess, deleteAdFailure,
  //fetchActiveAdsRequest, fetchActiveAdsSuccess, fetchActiveAdsFailure,
  clearAdError
} from './adReducer';

describe('ad reducer', () => {
  const initialState = {
    ads: [],
    //activeAds: [],
    currentAd: null,
    loading: false,
    error: null,
  };

  it('handles fetchAdRequest', () => {
    const state = reducer(initialState, fetchAdRequest());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles fetchAdSuccess', () => {
    const ad = { id: 1, title: '광고' };
    const state = reducer(initialState, fetchAdSuccess(ad));
    expect(state.currentAd).toEqual(ad);
  });

  it('handles fetchAdFailure', () => {
    const state = reducer(initialState, fetchAdFailure('fail'));
    expect(state.error).toBe('fail');
    expect(state.currentAd).toBeNull();
  });

  it('handles createAdSuccess', () => {
    const ad = { id: 2, title: '새 광고' };
    const state = reducer(initialState, createAdSuccess(ad));
    expect(state.ads[0]).toEqual(ad);
  });

  it('handles createAdFailure', () => {
    const state = reducer(initialState, createAdFailure('fail'));
    expect(state.error).toBe('fail');
  });

  it('handles updateAdSuccess', () => {
    const prev = { ...initialState, ads: [{ id: 1, title: 'old' }], currentAd: { id: 1, title: 'old' } };
    const updated = { id: 1, title: 'new' };
    const state = reducer(prev, updateAdSuccess(updated));
    expect(state.ads[0].title).toBe('new');
    expect(state.currentAd).toEqual(updated);
  });

  it('handles updateAdFailure', () => {
    const state = reducer(initialState, updateAdFailure('fail'));
    expect(state.error).toBe('fail');
  });

  it('handles deleteAdRequest', () => {
    const state = reducer(initialState, deleteAdRequest());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles deleteAdSuccess', () => {
    const prev = { ...initialState, ads: [{ id: 1 }, { id: 2 }], currentAd: { id: 1 } };
    const state = reducer(prev, deleteAdSuccess(1));
    expect(state.ads).toEqual([{ id: 2 }]);
    expect(state.currentAd).toBeNull();
  });

  it('handles deleteAdFailure', () => {
    const state = reducer(initialState, deleteAdFailure('fail'));
    expect(state.error).toBe('fail');
  });

  it('handles clearAdError', () => {
    const prev = { ...initialState, error: '에러 발생' };
    const state = reducer(prev, clearAdError());
    expect(state.error).toBeNull();
  });

 // ✅ 추가된 테스트들
  // it('handles fetchActiveAdsRequest', () => {
  //   const state = reducer(initialState, fetchActiveAdsRequest());
  //   expect(state.loading).toBe(true);
  //   expect(state.error).toBeNull();
  // });

  // it('handles fetchActiveAdsSuccess', () => {
  //   const ads = [{ id: 1, title: '활성 광고' }];
  //   const state = reducer(initialState, fetchActiveAdsSuccess(ads));
  //   expect(state.activeAds).toEqual(ads);
  //   expect(state.loading).toBe(false);
  // });

  // it('handles fetchActiveAdsFailure', () => {
  //   const state = reducer(initialState, fetchActiveAdsFailure('fail'));
  //   expect(state.error).toBe('fail');
  //   expect(state.loading).toBe(false);
  // });

});