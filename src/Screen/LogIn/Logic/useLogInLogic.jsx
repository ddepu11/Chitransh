import { useEffect, useRef, useState } from 'react';
import {
  TwitterAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  // deleteUser,
} from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';

import { authInstance } from '../../../config/firebase';
import validateForm from '../../../utils/validateForm';
import clearAllSetTimeoutOrSetInterval from '../../../utils/clearAllSetTimeoutOrSetInterval';
import {
  notificationShowError,
  notificationShowInfo,
} from '../../../features/notification';
import { userLoadingBegins, userLoadingEnds } from '../../../features/user';

const useLogInLogic = () => {
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
  });

  const setTimeOutId = useRef(0);
  const emailValidationMessageTag = useRef(null);
  const passwordValidationMessageTag = useRef(null);

  useEffect(() => {
    console.log('Login use Effect');

    return () => {
      clearAllSetTimeoutOrSetInterval(setTimeOutId);
    };
  }, []);

  const dispatch = useDispatch();

  const logInUsingUserCredentials = () => {
    signInWithEmailAndPassword(
      authInstance,
      userCredentials.email,
      userCredentials.password
    )
      .then(() => {
        dispatch(notificationShowInfo({ msg: 'Successfully logged in!' }));
        dispatch(userLoadingEnds());
      })
      .catch((err) => {
        dispatch(notificationShowError({ msg: err.code }));
        dispatch(userLoadingEnds());
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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

  const handleLoginViaTwitter = () => {
    const provider = new TwitterAuthProvider();

    signInWithPopup(authInstance, provider)
      .then((user) => {
        console.log(user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { userLoading } = useSelector((state) => state.user.value);

  return {
    handleSubmit,
    userCredentials,
    handleInput,
    handleLoginViaTwitter,
    emailValidationMessageTag,
    passwordValidationMessageTag,
    userLoading,
  };
};

export default useLogInLogic;
