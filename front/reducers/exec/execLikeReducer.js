// reducers/likeReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likes: {},        
  likesCount: {},   
  loading: false,
  error: null,
};

const likeSlice = createSlice({   
  name: "like",
  initialState,
  reducers: {
    // 좋아요누르기
    addLikeRequest: (state) => { state.loading = true; state.error = null; },
    addLikeSuccess: (state, action) => {
      state.loading = false;
      const { postId, count } = action.payload;
      state.likes[postId] = true;
      state.likesCount[postId] = count;
    },
    addLikeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 좋아요삭제
    removeLikeRequest: (state) => { state.loading = true; state.error = null; },
    removeLikeSuccess: (state, action) => {
      state.loading = false;
      const { postId, count } = action.payload;
      state.likes[postId] = false;
      state.likesCount[postId] = count;
    },
    removeLikeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 좋아요 수
    countLikesRequest: (state) => { state.loading = true; state.error = null; },
    countLikesSuccess: (state, action) => {
      state.loading = false;
      const { postId, count } = action.payload;
      state.likesCount[postId] = count;
    },
    countLikesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 내가 좋아요
    fetchMyLikesRequest: (state) => { state.loading = true; state.error = null; },
    fetchMyLikesSuccess: (state, action) => {
      state.loading = false;
      const likedPosts = action.payload;  
      const likesObj = {};
      likedPosts.forEach(id => { likesObj[id] = true; });
      state.likes = { ...state.likes, ...likesObj };
    },
    fetchMyLikesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
 
export const {
  addLikeRequest, addLikeSuccess, addLikeFailure,
  removeLikeRequest, removeLikeSuccess, removeLikeFailure,
  countLikesRequest, countLikesSuccess, countLikesFailure,
  fetchMyLikesRequest, fetchMyLikesSuccess, fetchMyLikesFailure,
} = likeSlice.actions;
 
export default likeSlice.reducer;
