import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Loader from '../../Components/Loader';
import Feed from './Feed/Feed';

const Home = () => {
  const { userLoading } = useSelector((state) => state.user.value);

  if (userLoading) {
    return <Loader />;
  }

  return (
    <Wrapper className='w-960 flex'>
      <Feed />
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 5px 5px;
  justify-content: space-between;
`;

export default Home;
