import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import usePostsOperation from '../../../Components/usePostsOperation';

const useHomeLogic = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { hasUserLoggedIn, userLoading, info, id } = useSelector(
    (state) => state.user.value
  );

  const { allPosts, postLoading } = useSelector((state) => state.posts.value);

  const { getUpdatedPosts } = usePostsOperation();

  useEffect(() => {
    if (!hasUserLoggedIn) {
      history.push('/login');
    }

    if (allPosts.length === 0 && info && !postLoading)
      getUpdatedPosts(info, id);
  }, [
    hasUserLoggedIn,
    history,
    dispatch,
    allPosts.length,
    id,
    getUpdatedPosts,
    postLoading,
    info,
  ]);

  return {
    userLoading,
    allPosts,
    postLoading,
    info,
    id,
  };
};

export default useHomeLogic;
