import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ads: [],
  latestAds: [],   // ✅ 추가: 최신 광고 페이징 조회 결과를 저장할 상태
  currentAd: null,
  loading: false,
  error: null,
};

const adSlice = createSlice({
  name: 'ad',
  initialState,
  reducers: {
    // 광고 단건 조회
    fetchAdRequest: (state) => {
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

    // 광고 작성
    createAdRequest: (state) => {
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

    // 광고 수정
    updateAdRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateAdSuccess: (state, action) => {
      state.loading = false;
      // 기존 ads 배열에서 해당 광고를 찾아 교체
      state.ads = state.ads.map((ad) =>
        ad.id === action.payload.id ? action.payload : ad
      );
      state.currentAd = action.payload;
    },
    updateAdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 광고 삭제
    deleteAdRequest: (state) => {
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

    // ✅ 추가: 최신 광고 페이징 조회
    fetchLatestAdsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLatestAdsSuccess: (state, action) => {
      state.loading = false;
      //state.latestAds = action.payload; // 최신 광고 목록 저장
      // ✅ 응답이 Page 객체라면 content만 저장, 배열이면 그대로 저장 
      state.latestAds = action.payload?.content || action.payload || [];
    },
    fetchLatestAdsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 에러 초기화
    clearAdError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchAdRequest, fetchAdSuccess, fetchAdFailure,
  createAdRequest, createAdSuccess, createAdFailure,
  updateAdRequest, updateAdSuccess, updateAdFailure,
  deleteAdRequest, deleteAdSuccess, deleteAdFailure,
  fetchLatestAdsRequest, fetchLatestAdsSuccess, fetchLatestAdsFailure, // ✅ 추가된 액션 export
  clearAdError,
} = adSlice.actions;

export default adSlice.reducer;
