import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    allPosts: [],
    userPosts: [],
    postLoading: false,
  },
};

const posts = createSlice({
  name: 'posts',
  initialState,

  reducers: {
    postsLoadingBegins: (state = initialState) => {
      state.value = { ...state.value, postLoading: true };
    },

    storeUserPosts: (state = initialState, action) => {
      state.value = {
        ...state.value,
        postLoading: false,
        userPosts: action.payload,
      };
    },

    storeAllPosts: (state = initialState, action) => {
      state.value = {
        ...state.value,
        postLoading: false,
        allPosts: action.payload,
      };
    },

    postsLoadingEnds: (state = initialState) => {
      state.value = { ...state.value, postLoading: false };
    },
  },
});

export const {
  postsLoadingBegins,
  storeUserPosts,
  storeAllPosts,
  postsLoadingEnds,
} = posts.actions;

export default posts.reducer;
