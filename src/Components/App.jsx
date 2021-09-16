import styled from 'styled-components';
import SignIn from '../Screen/SignIn/SignIn';

const App = () => {
  console.log('App');
  return (
    <Wrapper className='w-960'>
      <SignIn />
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 10px;
`;

export default App;
