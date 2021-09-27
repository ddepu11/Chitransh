import styled from 'styled-components';
import Loader from '../../Components/Loader';
import Feed from './Feed/Feed';
import Post from '../../Components/Post/Post';
import useHomeLogic from './Logic/useHomeLogic';

const Home = () => {
  const { userLoading, allPosts, postLoading } = useHomeLogic();

  if (userLoading || postLoading) {
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
