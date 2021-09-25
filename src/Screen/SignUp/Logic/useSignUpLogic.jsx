import { useRef, useState, useEffect } from 'react';
import {
  fetchSignInMethodsForEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import clearAllSetTimeoutOrSetInterval from '../../../utils/clearAllSetTimeoutOrSetInterval';
import validateForm from '../../../utils/validateForm';
import { authInstance, firestoreInstance } from '../../../config/firebase';
import { userLoadingBegins, userLoadingEnds } from '../../../features/user';
import {
  notificationShowError,
  notificationShowSuccess,
} from '../../../features/notification';

const useSignUpLogic = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { hasUserLoggedIn } = useSelector((state) => state.user.value);
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    fullName: '',
    userName: '',
    password: '',
  });

  const setTimeOutId = useRef(0);

  useEffect(() => {
    if (hasUserLoggedIn) {
      history.push('/');
    }

    return () => {
      clearAllSetTimeoutOrSetInterval(setTimeOutId);
    };
  }, [history, hasUserLoggedIn]);

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
    )
      .then(() => {
        dispatch(notificationShowSuccess({ msg: 'Successfully siggned up!' }));
        dispatch(userLoadingEnds());
        setUserCredentials({
          email: '',
          fullName: '',
          userName: '',
          password: '',
        });
      })
      .catch((err) => {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        dispatch(userLoadingEnds());
      });
  };

  const saveUserDoc = async () => {
    try {
      const docRef = await addDoc(collection(firestoreInstance, 'users'), {
        id: uuidv4(),
        email: userCredentials.email,
        fullName: userCredentials.fullName,
        userName: userCredentials.userName,
        dp: {
          fileName: 'dummyDp',
          url: '',
        },
        bio: '',
        website: '',
        phoneNumber: '',
        gender: '',
        following: [],
        followers: [],
        createdOn: Date.now(),
        likedPostsIds: [],
      });

      if (docRef) {
        signUp();
      }
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      dispatch(userLoadingEnds());
    }
  };

  const checkIsEmailAddressAlreadyRegistered = () => {
    fetchSignInMethodsForEmail(authInstance, userCredentials.email)
      .then((isEmailAlreadyRegistered) => {
        if (isEmailAlreadyRegistered.length > 0) {
          // Email is already being used by someone else
          dispatch(
            notificationShowError({
              msg: 'this email address is already being used by someone else',
            })
          );
          dispatch(userLoadingEnds());
        } else {
          // Email is not being used by someone else
          // signUp();
          saveUserDoc();
        }
      })
      .catch((err) => {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        dispatch(userLoadingEnds());
      });
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
      dispatch(userLoadingBegins());
      checkIsEmailAddressAlreadyRegistered();
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUserCredentials({ ...userCredentials, [name]: value });
  };
  const { userLoading } = useSelector((state) => state.user.value);

  return {
    handleSubmit,
    handleInput,
    userCredentials,
    validationMessageTags,
    userLoading,
  };
};

export default useSignUpLogic;
