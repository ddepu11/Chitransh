import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Loader from '../../Components/Loader';

const Home = () => {
  const { userLoading } = useSelector((state) => state.user.value);

  if (userLoading) {
    return <Loader />;
  }

  return (
    <Wrapper className='w-960'>
      <h2>Home</h2>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 5px 5px;
`;

export default Home;
