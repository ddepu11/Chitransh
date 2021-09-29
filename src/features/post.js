import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    view: false,
    post: null,
  },
};

const post = createSlice({
  name: 'post',

  initialState,

  reducers: {
    viewPost: (state = initialState, action) => {
      state.value = { view: true, post: action.payload };
    },

    closePost: (state = initialState, action) => {
      state.value = { view: false, post: action.payload };
    },
  },
});

export const { closePost, viewPost } = post.actions;

export default post.reducer;
