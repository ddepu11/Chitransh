import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user';
import notificationReducer from '../features/notification';

const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
  },
});

export default store;
