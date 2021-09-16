import { useState } from 'react';
import { TwitterAuthProvider, signInWithPopup } from 'firebase/auth';
import { authInstance } from '../../../config/firebase';

const useLogInLogic = () => {
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const handleLoginViaTwitter = () => {
    console.log(userCredentials);

    const provider = new TwitterAuthProvider();

    signInWithPopup(authInstance, provider)
      .then((user) => {
        console.log(user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { handleSubmit, userCredentials, handleInput, handleLoginViaTwitter };
};

export default useLogInLogic;
