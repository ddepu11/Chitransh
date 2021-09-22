import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import isEmpty from 'validator/lib/isEmpty';
import isLength from 'validator/lib/isLength';
import setValidationMessage from '../../../utils/setValidationMessage';

import { firestoreInstance } from '../../../config/firebase';
import {
  notificationShowError,
  notificationShowInfo,
} from '../../../features/notification';
import {
  updateInfo,
  userLoadingBegins,
  userLoadingEnds,
} from '../../../features/user';

const useEditAccount = () => {
  const dispatch = useDispatch();
  const setTimeOutId = useRef(0);

  const { info, id, userLoading } = useSelector((state) => state.user.value);

  const [userInfo, setUserInfo] = useState({
    phoneNumber: info.phoneNumber,
    userName: info.userName,
    website: info.website,
    fullName: info.fullName,
    bio: info.bio,
    email: info.email,
  });

  const [gender, setGender] = useState(info.gender);

  const validationMessageTags = {
    fullNameVMTag: useRef(null),
    userNameVMTag: useRef(null),
    websiteVMTag: useRef(null),
    genderVMTag: useRef(null),
    phoneNumberVMTag: useRef(null),
    bioVMTag: useRef(null),
    emailVMTag: useRef(null),
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    // console.log({ name, value });

    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleGender = (e) => {
    const newGender = e.currentTarget.getAttribute('id');

    setGender(newGender);
  };

  const [handlingChangeGender, setHandlingChangeGender] = useState(false);

  const closeDialogBox = () => {
    setGender(info.gender);
    setHandlingChangeGender(false);
  };

  const openDialogBox = () => setHandlingChangeGender(true);

  const changeGender = async () => {
    if (gender) {
      dispatch(userLoadingBegins());
      closeDialogBox();

      const userRef = doc(firestoreInstance, 'users', id);

      try {
        await setDoc(userRef, { gender }, { merge: true });

        const docSnap = await getDoc(userRef);

        dispatch(updateInfo(docSnap.data()));
        setGender(gender);

        dispatch(
          notificationShowInfo({
            msg: 'successfully updated gender!!!',
          })
        );
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        dispatch(userLoadingEnds());
        closeDialogBox();
      }
    } else {
      dispatch(notificationShowInfo({ msg: 'Please select any gender!' }));
    }
  };

  const validateUserInfo = () => {
    const { phoneNumber, userName, website, fullName, bio, email } = userInfo;

    let errorFlag = false;

    // Essentials Validations
    // Full Name Validation
    if (!isLength(fullName, 0, 30)) {
      setValidationMessage(
        'name is too lenthy!',
        'error',
        setTimeOutId,
        validationMessageTags.fullNameVMTag
      );

      errorFlag = true;
    }

    if (isLength(fullName, 0, 5)) {
      setValidationMessage(
        'name is too short!',
        'error',
        setTimeOutId,
        validationMessageTags.fullNameVMTag
      );

      errorFlag = true;
    }

    if (isEmpty(fullName)) {
      setValidationMessage(
        "name can't be empty!",
        'error',
        setTimeOutId,
        validationMessageTags.fullNameVMTag
      );

      errorFlag = true;
    }

    // User Name Validation
    if (!isLength(userName, 0, 25)) {
      setValidationMessage(
        'use name is too lengthy!',
        'error',
        setTimeOutId,
        validationMessageTags.userNameVMTag
      );

      errorFlag = true;
    }

    if (isLength(userName, 0, 1)) {
      setValidationMessage(
        'use name is too short!',
        'error',
        setTimeOutId,
        validationMessageTags.userNameVMTag
      );

      errorFlag = true;
    }

    if (isEmpty(userName)) {
      setValidationMessage(
        'use name cant be empty!',
        'error',
        setTimeOutId,
        validationMessageTags.userNameVMTag
      );

      errorFlag = true;
    }

    return errorFlag;
  };

  const handleUpdateInfo = () => {
    if (
      userInfo.bio === info.bio &&
      userInfo.website === info.website &&
      userInfo.fullName === info.fullName &&
      userInfo.userName === info.userName
    ) {
      dispatch(notificationShowInfo({ msg: 'Sorry nothing to update!' }));
    } else {
      console.log(userInfo);
      validateUserInfo();
    }
  };

  return {
    userInfo,
    handleInput,
    validationMessageTags,
    handlingChangeGender,
    setHandlingChangeGender,
    closeDialogBox,
    openDialogBox,
    gender,
    handleGender,
    changeGender,
    userLoading,
    handleUpdateInfo,
  };
};

export default useEditAccount;
