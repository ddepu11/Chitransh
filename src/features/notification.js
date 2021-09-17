import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { message: null, success: false, error: false },
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
  },
});

export const { notificationShowError, notificationShowSuccess } =
  notificationSlice.actions;

export default notificationSlice.reducer;
