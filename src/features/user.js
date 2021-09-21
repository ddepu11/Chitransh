import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    userLoading: false,
    hasUserLoggedIn: false,
    id: null,
    info: null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoadingBegins: (state = initialState) => {
      state.value = { ...state.value, userLoading: true };
    },

    userLoggedIn: (state = initialState, action) => {
      state.value = {
        ...state.value,
        userLoading: false,
        hasUserLoggedIn: true,
        info: action.payload.info,
        id: action.payload.id,
      };
    },

    userLoggedOut: (state = initialState) => {
      state.value = {
        ...state.value,
        userLoading: false,
        hasUserLoggedIn: false,
        info: null,
        id: null,
      };
    },

    userLoadingEnds: (state = initialState) => {
      state.value = { ...state.value, userLoading: false };
    },

    updateInfo: (state = initialState, action) => {
      state.value = {
        ...state.value,
        userLoading: false,
        info: action.payload,
      };
    },
  },
});

export const {
  userLoadingBegins,
  userLoadingEnds,
  userLoggedIn,
  userLoggedOut,
  updateInfo,
} = userSlice.actions;

export default userSlice.reducer;
