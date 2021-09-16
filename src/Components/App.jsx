import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { authInstance } from '../config/firebase';
import Home from '../Screen/Home/Home';
import LogIn from '../Screen/LogIn/LogIn';
import PrivacyPolicy from '../Screen/PrivacyPolicy/PrivacyPolicy';
import SignUp from '../Screen/SignUp/SignUp';
import TermsOfService from '../Screen/TermsOfService/TermsOfService';

const App = () => {
  useEffect(() => {
    const unsub = authInstance.onAuthStateChanged((user) => {
      if (user && user.providerData.length > 0) {
        // console.log(user.providerData[0].email);
        console.log('Sign In');
      } else {
        authInstance.signOut();
        console.log('Sign Out');
      }
    });

    return () => {
      console.log('Clean Up App');
      unsub();
    };
  }, []);

  return (
    <Wrapper className='w-960'>
      <Router>
        <Switch>
          <Route path='/login' exact>
            <LogIn />
          </Route>

          <Route path='/' exact>
            <Home />
          </Route>

          <Route path='/signup' exact>
            <SignUp />
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
