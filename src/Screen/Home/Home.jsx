import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { firestoreInstance } from '../../config/firebase';
import Loader from '../../Components/Loader';
import {
  postsLoadingBegins,
  postsLoadingEnds,
  storeAllPosts,
} from '../../features/posts';
import Feed from './Feed/Feed';
import Post from '../../Components/Post/Post';

import { notificationShowError } from '../../features/notification';

const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { hasUserLoggedIn, userLoading } = useSelector(
    (state) => state.user.value
  );

  const { allPosts } = useSelector((state) => state.posts.value);

  useEffect(() => {
    if (!hasUserLoggedIn) {
      history.push('/login');
    }

    const fetchAllPosts = async () => {
      dispatch(postsLoadingBegins());

      try {
        const postsSnapshot = await getDocs(
          collection(firestoreInstance, 'posts')
        );

        let index = 0;

        const posts = [];

        postsSnapshot.forEach((doc) => {
          posts.push(doc.data());

          if (index === postsSnapshot.size - 1) {
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

  if (userLoading) {
    return <Loader />;
  }

  return (
    <Wrapper className='w-960 '>
      <HomeDiv className='home'>
        {allPosts && allPosts.map((post) => <Post key={post.id} post={post} />)}
      </HomeDiv>

      <Feed />
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 5px 5px;
  display: flex;
  justify-content: space-between;
  padding-top: 40px;
`;

const HomeDiv = styled.div`
  width: 63%;
`;

export default Home;
