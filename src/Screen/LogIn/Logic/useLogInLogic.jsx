import { useEffect, useRef, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { authInstance } from '../../../config/firebase';
import validateForm from '../../../utils/validateForm';
import clearAllSetTimeoutOrSetInterval from '../../../utils/clearAllSetTimeoutOrSetInterval';
import { notificationShowError } from '../../../features/notification';
import { userLoadingBegins, userLoadingEnds } from '../../../features/user';

const useLogInLogic = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
  });

  const setTimeOutId = useRef(0);
  const emailValidationMessageTag = useRef(null);
  const passwordValidationMessageTag = useRef(null);

  const { hasUserLoggedIn } = useSelector((state) => state.user.value);

  useEffect(() => {
    if (hasUserLoggedIn) {
      history.push('/');
    }

    return () => {
      clearAllSetTimeoutOrSetInterval(setTimeOutId);
    };
  }, [hasUserLoggedIn, history]);

  const logInUsingUserCredentials = () => {
    signInWithEmailAndPassword(
      authInstance,
      userCredentials.email,
      userCredentials.password
    )
      .then(() => {})
      .catch((err) => {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        dispatch(userLoadingEnds());
      });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const error = validateForm(
      userCredentials,
      {
        emailValidationMessageTag,
        passwordValidationMessageTag,
      },
      setTimeOutId
    );

    if (!error) {
      dispatch(userLoadingBegins());
      logInUsingUserCredentials();
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const { userLoading } = useSelector((state) => state.user.value);

  const loginAsRandomUser = () => {
    dispatch(userLoadingBegins());

    const users = [
      { email: 'ddepu11@gmail.com', password: 'aaaaaa' },
      { email: 'mohan11@gmail.com', password: 'aaaaaa' },
      { email: 'vibe.natureza11@gmail.com', password: 'aaaaaa' },
      { email: 'theprint22@yahoo.com', password: 'aaaaaa' },
      { email: 'vickykaushal09@gmail.com', password: 'aaaaaa' },
      { email: 'theweekend34@gmail.com', password: 'aaaaaa' },
      { email: 'aayush11@gmail.com', password: 'aaaaaa' },
    ];
    const randomUsers = Math.floor(Math.random() * users.length);

    signInWithEmailAndPassword(
      authInstance,
      users[randomUsers].email,
      users[randomUsers].password
    )
      .then(() => {})
      .catch((err) => {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        dispatch(userLoadingEnds());
      });
  };

  return {
    handleSubmit,
    userCredentials,
    handleInput,
    emailValidationMessageTag,
    passwordValidationMessageTag,
    userLoading,
    loginAsRandomUser,
  };
};

export default useLogInLogic;
