import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { authInstance, firestoreInstance } from '../config/firebase';
import Home from '../Screen/Home/Home';
import LogIn from '../Screen/LogIn/LogIn';
import PrivacyPolicy from '../Screen/PrivacyPolicy/PrivacyPolicy';
import SignUp from '../Screen/SignUp/SignUp';
import TermsOfService from '../Screen/TermsOfService/TermsOfService';
import useNotification from '../Screen/useNotification';
import {
  userLoadingBegins,
  userLoadingEnds,
  userLoggedIn,
  userLoggedOut,
} from '../features/user';
import {
  notificationShowError,
  notificationShowInfo,
} from '../features/notification';
import Navbar from '../Screen/Navbar/Navbar';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userLoadingBegins());

    const fetchUserData = async (email) => {
      try {
        const usersRef = collection(firestoreInstance, 'users');

        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          dispatch(
            notificationShowInfo({ msg: `Welcome back ${doc.data().fullName}` })
          );

          dispatch(userLoggedIn({ id: doc.id, info: doc.data() }));
          dispatch(userLoadingEnds());
        });
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        dispatch(userLoadingEnds());
      }
    };

    const unsub = authInstance.onAuthStateChanged((user) => {
      if (user && user.providerData.length > 0) {
        const { email } = user.providerData[0];

        fetchUserData(email);
      } else {
        authInstance.signOut();
        dispatch(userLoggedOut());
        dispatch(userLoadingEnds());
      }
    });

    return () => {
      unsub();
    };
  }, [dispatch]);

  const { errorNotification, successNotification, infoNotification } =
    useNotification();

  const { hasUserLoggedIn } = useSelector((state) => state.user.value);

  const { message, success, error, info } = useSelector(
    (state) => state.notification.value
  );

  // For Showing notification
  useEffect(() => {
    if (message && success) {
      successNotification(message);
    }

    if (message && error) {
      errorNotification(message);
    }

    if (message && info) {
      infoNotification(message);
    }
  }, [
    message,
    success,
    error,
    info,
    successNotification,
    errorNotification,
    infoNotification,
  ]);

  return (
    <>
      <ToastContainer />

      <Wrapper>
        <Router>
          {hasUserLoggedIn && <Navbar />}
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
    </>
  );
};

const Wrapper = styled.main``;

export default App;
