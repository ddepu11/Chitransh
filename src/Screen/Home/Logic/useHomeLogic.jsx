import { getDocs, query, orderBy, collection } from 'firebase/firestore';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { firestoreInstance } from '../../../config/firebase';
import { notificationShowError } from '../../../features/notification';
import {
  postsLoadingBegins,
  postsLoadingEnds,
  storeAllPosts,
} from '../../../features/posts';

const useHomeLogic = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { hasUserLoggedIn, userLoading } = useSelector(
    (state) => state.user.value
  );

  const { allPosts, postLoading } = useSelector((state) => state.posts.value);

  useEffect(() => {
    if (!hasUserLoggedIn) {
      history.push('/login');
    }

    const fetchAllPosts = async () => {
      dispatch(postsLoadingBegins());

      try {
        const userCollection = collection(firestoreInstance, 'posts');

        let index = 0;
        const posts = [];

        const q = query(userCollection, orderBy('createdOn', 'desc'));

        const userSnapshot = await getDocs(q);

        userSnapshot.forEach((u) => {
          posts.push(u.data());

          if (index === userSnapshot.size - 1) {
            dispatch(storeAllPosts(posts));
          }
          index += 1;
        });
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        dispatch(postsLoadingEnds());
      }
    };

    if (allPosts.length === 0) fetchAllPosts();
  }, [hasUserLoggedIn, history, dispatch, allPosts.length]);

  return {
    userLoading,
    allPosts,
    postLoading,
  };
};

export default useHomeLogic;
