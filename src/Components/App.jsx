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
import SignUp from '../Screen/SignUp/SignUp';
import useNotification from '../Screen/useNotification';
import {
  userLoadingBegins,
  userLoadingEnds,
  userLoggedIn,
  userLoggedOut,
} from '../features/user';

import {
  notificationClear,
  notificationShowError,
  notificationShowInfo,
} from '../features/notification';
import Navbar from '../Screen/Navbar/Navbar';
import Profile from '../Screen/Profile/Profile';
import EditAccount from '../Screen/EditAccount/EditAccount';
import ProtectedRoute from './ProtectedRoute';
import Post from './Post/Post';
import ErrorScreen from '../Screen/ErrorScreen';

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
  const { view, post } = useSelector((state) => state.post.value);

  const { message, success, error, info } = useSelector(
    (state) => state.notification.value
  );

  // For Showing notification
  useEffect(() => {
    if (message && success) {
      dispatch(notificationClear());
      successNotification(message);
    }

    if (error) {
      dispatch(notificationClear());
      errorNotification(message);
    }

    if (message && info) {
      dispatch(notificationClear());
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
    dispatch,
  ]);

  return (
    <>
      <ToastContainer />

      <Wrapper>
        <Router>
          {hasUserLoggedIn && <Navbar />}

          {view && (
            <>
              {document.body.classList.add('dialog_active')}

              <Post post={post} viewPost={true} />
            </>
          )}

          <Switch>
            <Route path='/' exact>
              <Home />
            </Route>

            <Route path='/login' exact>
              <LogIn />
            </Route>

            <Route path='/signup' exact>
              <SignUp />
            </Route>

            <ProtectedRoute
              path='/accounts/edit/'
              isAuthenticated={hasUserLoggedIn}
              component={EditAccount}
            />

            <ProtectedRoute
              path='/profile/:userId/'
              isAuthenticated={hasUserLoggedIn}
              component={Profile}
            />

            <ProtectedRoute
              path='/:userName/'
              isAuthenticated={hasUserLoggedIn}
              component={Profile}
            />

            <ProtectedRoute
              path='/:userName/saved/'
              isAuthenticated={hasUserLoggedIn}
              component={Profile}
            />

            <Route>
              <ErrorScreen />
            </Route>
          </Switch>
        </Router>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.main`
  position: relative;
`;

export default App;
