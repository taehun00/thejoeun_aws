import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviewLikes: {},   // { reviewId: count }
  reviewLikedByMe: {},    // { reviewId: true | false }
  testerLikes: {},   // { testerId: count }
  testerLikedByMe: {},    // { testerId: true | false }
  loading: false,
  error: null,
};

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    likeReviewRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    likeReviewSuccess: (state, action) => {
      state.loading = false;
      const { reviewId, count } = action.payload;

      state.reviewLikes[reviewId] = count;
      state.reviewLikedByMe[reviewId] = true;
    },

    likeReviewFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    removeLikeReviewRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    removeLikeReviewSuccess: (state, action) => {
      state.loading = false;
      const { reviewId, count } = action.payload;

      state.reviewLikes[reviewId] = count;
      state.reviewLikedByMe[reviewId] = false;
    },

    removeLikeReviewFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    likeTesterRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    likeTesterSuccess: (state, action) => {
      state.loading = false;
      const { testerId, count } = action.payload;

      state.testerLikes[testerId] = count;
      state.testerLikedByMe[testerId] = true;
    },

    likeTesterFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    removeLikeTesterRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    removeLikeTesterSuccess: (state, action) => {
      state.loading = false;
      const { testerId, count } = action.payload;

      state.testerLikes[testerId] = count;
      state.testerLikedByMe[testerId] = false;
    },

    removeLikeTesterFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },


    // --- 좋아요 수 조회 ---
    countLikesReviewRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    countLikesReviewSuccess: (state, action) => {
      state.loading = false;
      const { reviewId, count } = action.payload;

      state.reviewLikes[reviewId] = count;
    },
    countLikesReviewFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    checkLikeReviewMeRequest: (state) => {
      state.loading = true;
    },
    checkLikeReviewMeSuccess: (state, action) => {
      state.loading = false;
      const { reviewId, liked } = action.payload;
      state.reviewLikedByMe[reviewId] = liked;
    },
    checkLikeReviewMeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    countLikesTesterRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    countLikesTesterSuccess: (state, action) => {
      state.loading = false;
      const { testerId, count } = action.payload;

      state.testerLikes[testerId] = count;

      if (state.testerLikedByMe[testerId] === undefined) {
        state.testerLikedByMe[testerId] = false;
      }
    },
    countLikesTesterFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});


export const {
  likeReviewRequest, likeReviewSuccess, likeReviewFailure,
  removeLikeReviewRequest, removeLikeReviewSuccess, removeLikeReviewFailure,
  likeTesterRequest, likeTesterSuccess, likeTesterFailure,
  removeLikeTesterRequest, removeLikeTesterSuccess, removeLikeTesterFailure,
  countLikesReviewRequest, countLikesReviewSuccess, countLikesReviewFailure,
  checkLikeReviewMeRequest, checkLikeReviewMeSuccess, checkLikeReviewMeFailure,
  countLikesTesterRequest, countLikesTesterSuccess, countLikesTesterFailure
} = likesSlice.actions;

export default likesSlice.reducer;
