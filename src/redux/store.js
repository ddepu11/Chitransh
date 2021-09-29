import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user';
import notificationReducer from '../features/notification';
import postsReducer from '../features/posts';
import postReducer from '../features/post';

const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
    posts: postsReducer,
    post: postReducer,
  },
});

export default store;
