import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { authInstance } from '../config/firebase';
import LogIn from '../Screen/LogIn/LogIn';
import PrivacyPolicy from '../Screen/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from '../Screen/TermsOfService/TermsOfService';

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
      <Router>
        <Switch>
          <Route path='/' exact>
            <LogIn />
          </Route>

          <Route path='/privacy-policy' exact>
            <PrivacyPolicy />
          </Route>

          <Route path='/terms-of-service' exact>
            <TermsOfService />
          </Route>
        </Switch>
      </Router>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 10px;
`;

export default App;
