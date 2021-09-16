import { useRef, useState, useEffect } from 'react';
import {
  fetchSignInMethodsForEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import clearAllSetTimeoutOrSetInterval from '../../../utils/clearAllSetTimeoutOrSetInterval';
import validateForm from '../../../utils/validateForm';
import { authInstance } from '../../../config/firebase';

const useSignUpLogic = () => {
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    fullName: '',
    userName: '',
    password: '',
  });

  const setTimeOutId = useRef(0);

  useEffect(() => {
    console.log('SignUp');

    return () => {
      clearAllSetTimeoutOrSetInterval(setTimeOutId);
    };
  }, []);

  const validationMessageTags = {
    emailValidationMessageTag: useRef(null),
    fullNameValidationMessageTag: useRef(null),
    userNameValidationMessageTag: useRef(null),
    passwordValidationMessageTag: useRef(null),
  };

  const signUp = () => {
    createUserWithEmailAndPassword(
      authInstance,
      userCredentials.email.trim(),
      userCredentials.password.trim()
    ).then((user) => {
      console.log(user);
    });
  };

  const saveUserInfoInFireStore = () => {};

  const checkIsEmailAddressAlreadyRegistered = () => {
    fetchSignInMethodsForEmail(authInstance, userCredentials.email)
      .then((isEmailAlreadyRegistered) => {
        if (isEmailAlreadyRegistered.length > 0) {
          // Email is already being used by someone else
          console.log(isEmailAlreadyRegistered);
        } else {
          // Email is not being used by someone else
          // signUp();
          saveUserInfoInFireStore();
        }
      })
      .catch();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errorFlag = validateForm(
      userCredentials,
      validationMessageTags,
      setTimeOutId,
      'SIGN_UP'
    );

    if (!errorFlag) {
      checkIsEmailAddressAlreadyRegistered();
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUserCredentials({ ...userCredentials, [name]: value });
  };

  return { handleSubmit, handleInput, userCredentials, validationMessageTags };
};

export default useSignUpLogic;
