import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  retweets: {},       
  retweetsCount: {},  
  loading: false,
  error: null,
};

const retweetSlice = createSlice({
  name: 'retweet',
  initialState,
  reducers: {
    addRetweetRequest: (state) => { state.loading = true; },
    addRetweetSuccess: (state, action) => {
      state.loading = false;
      const { postId, retweetCount } = action.payload; 
      state.retweets[postId] = true;
      state.retweetsCount[postId] = retweetCount;      
    },
    addRetweetFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    removeRetweetRequest: (state) => { state.loading = true; },
    removeRetweetSuccess: (state, action) => {
      state.loading = false;
      const { postId, retweetCount } = action.payload; 
      state.retweets[postId] = false;
      state.retweetsCount[postId] = retweetCount;     
    },
    removeRetweetFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    hasRetweetedRequest: (state) => { state.loading = true; },
    hasRetweetedSuccess: (state, action) => {
      state.loading = false;
      const { postId, hasRetweeted } = action.payload;
      state.retweets[postId] = hasRetweeted;
    },
    hasRetweetedFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchMyRetweetsRequest: (state) => { state.loading = true; },
    fetchMyRetweetsSuccess: (state, action) => {
      state.loading = false;
      const retweetedPosts = action.payload; // { postId: true }
      state.retweets = { ...state.retweets, ...retweetedPosts };  
    },
    fetchMyRetweetsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  addRetweetRequest, addRetweetSuccess, addRetweetFailure,
  removeRetweetRequest, removeRetweetSuccess, removeRetweetFailure,
  hasRetweetedRequest, hasRetweetedSuccess, hasRetweetedFailure,
  fetchMyRetweetsRequest, fetchMyRetweetsSuccess, fetchMyRetweetsFailure,
} = retweetSlice.actions;

export default retweetSlice.reducer;
