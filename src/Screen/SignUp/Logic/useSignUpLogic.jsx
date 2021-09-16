import { useRef, useState, useEffect } from 'react';
import clearAllSetTimeoutOrSetInterval from '../../../utils/clearAllSetTimeoutOrSetInterval';
import validateForm from '../../../utils/validateForm';

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const errorFlag = validateForm(
      userCredentials,
      validationMessageTags,
      setTimeOutId,
      'SIGN_UP'
    );

    console.log(errorFlag);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUserCredentials({ ...userCredentials, [name]: value });
  };

  return { handleSubmit, handleInput, userCredentials, validationMessageTags };
};

export default useSignUpLogic;
