import { useEffect, useRef, useState } from 'react';
import { TwitterAuthProvider, signInWithPopup } from 'firebase/auth';
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
    console.log(userCredentials);

    return () => {
      clearAllSetTimeoutOrSetInterval(setTimeOutId);
    };
  }, [userCredentials]);

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm(
      userCredentials,
      {
        emailValidationMessageTag,
        passwordValidationMessageTag,
      },
      setTimeOutId
    );
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const handleLoginViaTwitter = () => {
    const provider = new TwitterAuthProvider();

    signInWithPopup(authInstance, provider)
      .then(() => {
        // console.log();
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
