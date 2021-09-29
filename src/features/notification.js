import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { message: null, success: false, error: false, info: false },
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,

  reducers: {
    notificationShowError: (state = initialState, action) => {
      state.value = {
        ...state.value,
        message: action.payload.msg,
        success: false,
        error: true,
      };
    },

    notificationShowSuccess: (state = initialState, action) => {
      state.value = {
        ...state.value,
        message: action.payload.msg,
        error: false,
        success: true,
      };
    },

    notificationShowInfo: (state = initialState, action) => {
      state.value = {
        ...state.value,
        message: action.payload.msg,
        error: false,
        success: false,
        info: true,
      };
    },

    notificationClear: (state = initialState) => {
      state.value = {
        message: null,
        success: false,
        error: false,
        info: false,
      };
    },
  },
});

export const {
  notificationShowError,
  notificationShowSuccess,
  notificationShowInfo,
  notificationClear,
} = notificationSlice.actions;

export default notificationSlice.reducer;
