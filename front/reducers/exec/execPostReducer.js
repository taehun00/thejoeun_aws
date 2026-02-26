// reducers/postReducer
import { createSlice } from '@reduxjs/toolkit';
 
const initialState = {
  posts: [],             
  likedPosts: [],         
  currentPost: null,      
  myAndRetweets: [],    
  loading: false,      
  error: null,           
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: { 
    fetchPostsRequest: (state) => { state.loading = true; state.error = null; },
    fetchPostsSuccess: (state, action) => {
      state.loading = false;
      state.posts = action.payload;  
    },
    fetchPostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
 
    fetchPostRequest: (state) => { state.loading = true; state.error = null; },
    fetchPostSuccess: (state, action) => {
      state.loading = false;
      state.currentPost = action.payload;
    },
    fetchPostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.currentPost = null;  
    },
 
    fetchPostsPagedRequest: (state) => { state.loading = true; state.error = null; },
    fetchPostsPagedSuccess: (state, action) => {
      state.loading = false; 
      const merged = [...state.posts, ...action.payload]; 
      const unique = merged.filter(
        (post, index, self) => index === self.findIndex(p => p.id === post.id)
      ); 
      state.posts = unique.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    fetchPostsPagedFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
 
    fetchLikedPostsRequest: (state) => { state.loading = true; state.error = null; },
    fetchLikedPostsSuccess: (state, action) => {
      state.loading = false;
      state.likedPosts = action.payload;
    },
    fetchLikedPostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
 
    fetchMyAndRetweetsRequest: (state) => { state.loading = true; state.error = null; },
    fetchMyAndRetweetsSuccess: (state, action) => {
      state.loading = false;
      state.myAndRetweets = action.payload;
    },
    fetchMyAndRetweetsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
 
    createPostRequest: (state) => { state.loading = true; state.error = null; },
    createPostSuccess: (state, action) => {
      state.loading = false;
      state.posts.unshift(action.payload);  
    },
    createPostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
 
    updatePostRequest: (state) => { state.loading = true; state.error = null; },
    updatePostSuccess: (state, action) => {
      state.loading = false;
      state.posts = state.posts.map(p =>
        p.id === action.payload.id ? action.payload : p
      );
      state.currentPost = action.payload; 
    },
    updatePostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
 
    deletePostRequest: (state) => { state.loading = true; state.error = null; },
    deletePostSuccess: (state, action) => {
      state.loading = false;
      state.posts = state.posts.filter(p => p.id !== action.payload);
    },
    deletePostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
 
export const {
  fetchPostsRequest, fetchPostsSuccess, fetchPostsFailure,
  fetchPostRequest, fetchPostSuccess, fetchPostFailure,
  fetchPostsPagedRequest, fetchPostsPagedSuccess, fetchPostsPagedFailure,
  fetchLikedPostsRequest, fetchLikedPostsSuccess, fetchLikedPostsFailure,
  fetchMyAndRetweetsRequest, fetchMyAndRetweetsSuccess, fetchMyAndRetweetsFailure,
  createPostRequest, createPostSuccess, createPostFailure,
  updatePostRequest, updatePostSuccess, updatePostFailure,
  deletePostRequest, deletePostSuccess, deletePostFailure,
} = postSlice.actions;

export default postSlice.reducer;
