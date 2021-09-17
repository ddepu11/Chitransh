import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    userLoading: false,
    hasUserLoggedIn: false,
    id: null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoadingBegins: (state = initialState) => {
      state.value = { ...state.value, userLoading: true };
    },

    userLoadingEnds: (state = initialState) => {
      state.value = { ...state.value, userLoading: false };
    },
  },
});

export const { userLoadingBegins, userLoadingEnds } = userSlice.actions;

export default userSlice.reducer;
