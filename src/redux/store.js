import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user';
import notificationReducer from '../features/notification';
import postReducer from '../features/posts';

const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
    posts: postReducer,
  },
});

export default store;
