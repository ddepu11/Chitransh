import { useRef, useState } from 'react';

const useSignUpLogic = () => {
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    fullName: '',
    userName: '',
    password: '',
  });

  const validationMessageTags = {
    emailValidationMessageTag: useRef(null),
    fullNameValidationMessageTag: useRef(null),
    userNameValidationMessageTag: useRef(null),
    passwordValidationMessageTag: useRef(null),
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(userCredentials);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUserCredentials({ ...userCredentials, [name]: value });
  };

  return { handleSubmit, handleInput, userCredentials, validationMessageTags };
};

export default useSignUpLogic;
