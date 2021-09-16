import { useEffect } from 'react';
import styled from 'styled-components';
import { authInstance } from '../config/firebase';
import LogIn from '../Screen/LogIn/LogIn';

const App = () => {
  useEffect(() => {
    authInstance.onAuthStateChanged((user) => {
      if (user) {
        console.log(user.email);
      }
    });
  }, []);

  return (
    <Wrapper className='w-960'>
      <LogIn />
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 10px;
`;

export default App;
