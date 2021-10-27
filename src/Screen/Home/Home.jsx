import styled from 'styled-components';
import Loader from '../../Components/Loader';
import Feed from './Feed/Feed';
import Post from '../../Components/Post/Post';
import useHomeLogic from './Logic/useHomeLogic';
import CircleLoader from '../../Components/CircleLoader';

const Home = () => {
  const { userLoading, allPosts, info, id, loading } = useHomeLogic();

  if (userLoading) {
    return <Loader />;
  }

  return (
    <Wrapper className='w-960 '>
      {loading ? (
        <CircleLoader cirH='50px' cirW='50px' wrapperMargin='0 auto' />
      ) : (
        <HomeDiv className='home'>
          {allPosts.length !== 0 ? (
            allPosts.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <div className='no_posts flex'>
              <h1>Sorry, there are no post to see!</h1>

              <p>
                You need to follow people or create your own posts to see posts
              </p>
            </div>
          )}
        </HomeDiv>
      )}

      {info && <Feed info={info} id={id} />}
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

  .no_posts {
    flex-direction: column;
    border: 1px dashed #dad9d9;
    height: 250px;

    h1 {
      font-size: 1.3em;
      color: #7a7a7a;
    }

    p {
      font-size: 1em;
      margin-top: 10px;
      color: #7a7a7a;
    }
  }
`;

export default Home;
