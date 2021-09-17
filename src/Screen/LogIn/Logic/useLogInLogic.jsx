import { useEffect, useRef, useState } from 'react';
import {
  TwitterAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  // deleteUser,
} from 'firebase/auth';

import { authInstance } from '../../../config/firebase';
import validateForm from '../../../utils/validateForm';
import clearAllSetTimeoutOrSetInterval from '../../../utils/clearAllSetTimeoutOrSetInterval';

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

  const logInUsingUserCredentials = () => {
    signInWithEmailAndPassword(
      authInstance,
      userCredentials.email,
      userCredentials.password
    )
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((err) => {
        console.log(err.message);
        console.log(err.code);
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
      console.log(error);
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

  return {
    handleSubmit,
    userCredentials,
    handleInput,
    handleLoginViaTwitter,
    emailValidationMessageTag,
    passwordValidationMessageTag,
  };
};

export default useLogInLogic;
