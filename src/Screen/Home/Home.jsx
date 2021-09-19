import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Loader from '../../Components/Loader';
import Feed from './Feed/Feed';

const Home = () => {
  const history = useHistory();
  const { hasUserLoggedIn, userLoading } = useSelector(
    (state) => state.user.value
  );

  useEffect(() => {
    if (!hasUserLoggedIn) {
      history.push('/login');
    }
  }, [hasUserLoggedIn, history]);

  if (userLoading) {
    return <Loader />;
  }

  return (
    <Wrapper className='w-960 flex'>
      <h1>Home</h1>
      <Feed />
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 5px 5px;
  justify-content: space-between;
`;

export default Home;
