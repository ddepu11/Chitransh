import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onSnapshot, query, collection, where } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { firestoreInstance } from '../../../config/firebase';

const useHomeLogic = () => {
  const dispatch = useDispatch();

  const history = useHistory();

  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { hasUserLoggedIn, userLoading, info, id } = useSelector(
    (state) => state.user.value
  );

  useEffect(() => {
    if (!hasUserLoggedIn) {
      history.push('/login');
    }

    let unsub = () => {};

    if (info) {
      setLoading(true);

      const q = query(
        collection(firestoreInstance, 'posts'),
        where('userId', 'in', [...info.following, id])
      );

      unsub = onSnapshot(q, (postsSnap) => {
        let index = 0;
        const newPosts = [];

        postsSnap.forEach((item) => {
          newPosts.push(item.data());

          if (index === postsSnap.size - 1) {
            setAllPosts(newPosts.sort((a, b) => b.createdOn - a.createdOn));
            setLoading(false);
          }

          index += 1;
        });

        if (postsSnap.size === 0) {
          setLoading(false);
        }
      });
    }

    return () => {
      unsub();
    };
  }, [hasUserLoggedIn, history, dispatch, id, info]);

  return {
    userLoading,
    allPosts,
    info,
    id,
    loading,
  };
};

export default useHomeLogic;
