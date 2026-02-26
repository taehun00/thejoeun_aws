import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  followersMap: {},    // 팔로워 여부 {  followerId : true } 
  followingsMap: {},   // 팔로워 여부 {  followeeId : true }    
  followersList: [],   // 화면 렌더링용 배열 
  followingsList: [],  // 화면 렌더링용 배열 
  loading: false,
  error: null,
};

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: { 
    // 팔로우 요청
    followRequest: (state) => {    state.loading = true;   state.error = null; },
    followSuccess: (state, action) => {
      state.loading = false;
      const { followeeId /*, blocked*/  } = action.payload;
      const id = String(followeeId);
  
      state.followingsMap = {
        ...state.followingsMap,
        [id]: true,
      };
 
      if (!state.followingsList.find(f => String(f.followeeId) === id)) {
        state.followingsList = [
          ...state.followingsList,
          { followeeId: id  /*, blocked: blocked ?? false */ },
        ];
      }
    },
    followFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
 
    unfollowRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    unfollowSuccess: (state, action) => {
      state.loading = false;
      const followeeId = String(action.payload);
 
      const newMap = { ...state.followingsMap };
      delete newMap[followeeId];
      state.followingsMap = newMap;
 
      state.followingsList = state.followingsList.filter(
        f => String(f.followeeId) !== followeeId
      );
    },
    unfollowFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
 
    toggleFollowRequest: (state) => {
      state.error = null;
    },
 
    loadFollowersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadFollowersSuccess: (state, action) => {
      state.loading = false;
      const followersObj = {};
      action.payload.forEach(f => {
        followersObj[String(f.followerId)] = true;
      });
      state.followersMap = followersObj;
      state.followersList = action.payload.map(f => ({
        ...f,
        followerId: String(f.followerId),
        //blocked: f.blocked ?? false,
      }));
    },
    loadFollowersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
 
    loadFollowingsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadFollowingsSuccess: (state, action) => {
      state.loading = false;
      const followingsObj = {};
      action.payload.forEach(f => {
        const id = String(f.followeeId ?? f.userId);
        followingsObj[id] = true;
      });
      state.followingsMap = followingsObj;
      state.followingsList = action.payload.map(f => ({
        ...f,
        followeeId: String(f.followeeId ?? f.userId),
        //blocked: f.blocked ?? false,
      }));
    },
    loadFollowingsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

 
  },
});
 
export const {
  followRequest, followSuccess, followFailure,
  unfollowRequest, unfollowSuccess, unfollowFailure,
  loadFollowersRequest, loadFollowersSuccess, loadFollowersFailure,
  loadFollowingsRequest, loadFollowingsSuccess, loadFollowingsFailure, 
  toggleFollowRequest,
} = followSlice.actions;

export default followSlice.reducer;
