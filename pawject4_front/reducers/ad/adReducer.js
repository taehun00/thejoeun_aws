import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ads: [],
  //activeAds: [], // 메인 페이지용 광고 목록 추가
  currentAd: null,
  loading: false,
  error: null,
};

const adSlice = createSlice({
  name: 'ad',
  initialState,
  reducers: {
    fetchAdRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    fetchAdSuccess: (state, action) => {
      state.loading = false;
      state.currentAd = action.payload;
    },
    fetchAdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.currentAd = null;
    },

    createAdRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    createAdSuccess: (state, action) => {
      state.loading = false;
      state.ads.unshift(action.payload);
    },
    createAdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateAdRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    updateAdSuccess: (state, action) => {
      state.loading = false;
      state.ads = state.ads.map((ad) =>
        ad.id === action.payload.id ? action.payload : ad
      );
      state.currentAd = action.payload;
    },
    updateAdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteAdRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    deleteAdSuccess: (state, action) => {
      state.loading = false;
      state.ads = state.ads.filter((ad) => ad.id !== action.payload);
      if (state.currentAd && state.currentAd.id === action.payload) {
        state.currentAd = null;
      }
    },
    deleteAdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    clearAdError: (state) => {
      state.error = null;
    }
  },

    // 리듀서 로직에 추가
    // 2. 메인 페이지 활성 광고 조회 요청
    // fetchActiveAdsRequest: (state) => {
    //   state.loading = true;
    //   state.error = null;
    // },
    // 3. 메인 페이지 활성 광고 조회 성공 (보내주신 로직 적용)
    // fetchActiveAdsSuccess: (state, action) => {
    //   state.activeAds = action.payload;
    //   state.loading = false;
    // },
    // 4. 실패 시 공통 처리
    // fetchActiveAdsFailure: (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // },

});
export const {
  fetchAdRequest, fetchAdSuccess, fetchAdFailure,
  createAdRequest, createAdSuccess, createAdFailure,
  updateAdRequest, updateAdSuccess, updateAdFailure,
  deleteAdRequest, deleteAdSuccess, deleteAdFailure,
  //fetchActiveAdsRequest, fetchActiveAdsSuccess, fetchActiveAdsFailure, 
  clearAdError
} = adSlice.actions;



export default adSlice.reducer;