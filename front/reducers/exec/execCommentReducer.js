import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  comments: {},  
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: { 
    // 댓글 조회
    fetchCommentsRequest: (state) => { state.loading = true; },
    fetchCommentsSuccess: (state, action) => {
      state.loading = false;
      const { postId, comments } = action.payload;  // 어떤 글에대한, 댓글들
      state.comments[postId] = comments;   
    },
    fetchCommentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
 
    // 댓글 작성
    createCommentRequest: (state) => { state.loading = true; },
    createCommentSuccess: (state, action) => {
      state.loading = false;
      const { postId, comment } = action.payload;  
      state.comments[postId] = [...(state.comments[postId] || []), comment];  //기존댓글 추가
    },
    createCommentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
 
    // 댓글 수정
    updateCommentRequest: (state) => { state.loading = true; },
    updateCommentSuccess: (state, action) => {
      state.loading = false;
      const { postId, comment } = action.payload; 
      state.comments[postId] = state.comments[postId].map(c =>
        c.id === comment.id ? comment : c
      );
    },
    updateCommentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
 
    // 댓글 삭제
    deleteCommentRequest: (state) => { state.loading = true; },
    deleteCommentSuccess: (state, action) => {
      state.loading = false;
      const { postId, commentId } = action.payload;  
      state.comments[postId] = state.comments[postId].filter(c => c.id !== commentId);
    },
    deleteCommentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCommentsRequest, fetchCommentsSuccess, fetchCommentsFailure,
  createCommentRequest, createCommentSuccess, createCommentFailure,
  updateCommentRequest, updateCommentSuccess, updateCommentFailure,
  deleteCommentRequest, deleteCommentSuccess, deleteCommentFailure,
} = commentSlice.actions;

export default commentSlice.reducer;
