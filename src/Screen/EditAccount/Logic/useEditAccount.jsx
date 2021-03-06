import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'validator/lib/isEmpty';
import isLength from 'validator/lib/isLength';
import contains from 'validator/lib/contains';
import isAlpha from 'validator/lib/isAlpha';
import {
  getDocs,
  updateDoc,
  where,
  query,
  doc,
  collection,
} from 'firebase/firestore';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { firestoreInstance } from '../../../config/firebase';

import useUserOperation from '../../../Components/useUserOperations';
import usePostsOperation from '../../../Components/usePostsOperation';
import setValidationMessage from '../../../utils/setValidationMessage';

import {
  notificationShowError,
  notificationShowInfo,
  notificationShowSuccess,
} from '../../../features/notification';
import clearAllSetTimeoutOrSetInterval from '../../../utils/clearAllSetTimeoutOrSetInterval';
import useCommentOperation from '../../../Components/useCommentOperation';

const useEditAccount = () => {
  const dispatch = useDispatch();

  const setTimeOutId = useRef(0);
  const { info, id } = useSelector((state) => state.user.value);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('');
    // ?$#$#$#$#$#$#$#$#$#$#$#$#$#$
    return () => {
      clearAllSetTimeoutOrSetInterval(setTimeOutId);
    };
  }, [id]);

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

    setUserInfo({ ...userInfo, [name]: value });
  };

  // #$##$#$##$#$##$#$#$#$  Handling Gender  #$#$#$#$$$#$#$#$#$#$
  const handleGender = (e) => {
    const newGender = e.currentTarget.getAttribute('id');

    setGender(newGender);
  };

  const [handlingChangeGender, setHandlingChangeGender] = useState(false);

  const closeDialogBox = () => {
    setGender(info.gender);
    setHandlingChangeGender(false);
  };

  const openDialogBox = () => {
    setHandlingChangeGender(true);
  };

  const { getUpdatedUserDoc, updateUserDoc } = useUserOperation(id);

  const changeGender = async () => {
    if (gender) {
      setLoading(true);

      closeDialogBox();

      try {
        await updateUserDoc({ gender }, id);

        await getUpdatedUserDoc(id);

        setGender(gender);

        setLoading(false);

        dispatch(
          notificationShowSuccess({
            msg: 'successfully updated gender!!!',
          })
        );
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));

        setLoading(false);
        closeDialogBox();
      }
    } else {
      dispatch(notificationShowInfo({ msg: 'Please select any gender!' }));
      closeDialogBox();
    }
  };

  // #$##$#$##$#$##$#$#$#$  Handling Gender Ends #$#$#$#$$$#$#$#$#$#$

  const validateUserInfo = () => {
    const { phoneNumber, userName, website, fullName } = userInfo;

    let errorFlag = false;

    // Essential Validations
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

    // If Website is not empty then validate
    if (!isEmpty(website)) {
      if (!contains(website, 'http://')) {
        if (!contains(website, 'https://')) {
          setValidationMessage(
            'invalid website',
            'error',
            setTimeOutId,
            validationMessageTags.websiteVMTag
          );
          errorFlag = true;
        }
      }

      if (!contains(website, '.com')) {
        if (!contains(website, '.in')) {
          if (!contains(website, '.netlify.app')) {
            if (!contains(website, '.io')) {
              setValidationMessage(
                'invalid website',
                'error',
                setTimeOutId,
                validationMessageTags.websiteVMTag
              );
              errorFlag = true;
            }
          }
        }
      }

      const invalidChars = [
        '%',
        '!',
        '~',
        '$',
        '%',
        '^',
        '&',
        '*',
        '(',
        ')',
        '+',
        '_',
        '\\',
        '=',
        '|',
        '`',
        '~',
        '#',
        ',',
        '?',
        ';',
        '{',
        '}',
        '*',
        '@',
      ];

      invalidChars.forEach((item) => {
        if (contains(website, item)) {
          setValidationMessage(
            `invalid website, ${item} not allowed!`,
            'error',
            setTimeOutId,
            validationMessageTags.websiteVMTag
          );
          errorFlag = true;
        }
      });

      if (isLength(website, 0, 11)) {
        setValidationMessage(
          'invalid website',
          'error',
          setTimeOutId,
          validationMessageTags.websiteVMTag
        );
        errorFlag = true;
      }
    }

    // If phoneNumber is not empty then validate
    if (!isEmpty(phoneNumber)) {
      if (phoneNumber.length < 10) {
        setValidationMessage(
          'phone nuber should be 10 numbers!',
          'error',
          setTimeOutId,
          validationMessageTags.phoneNumberVMTag
        );

        errorFlag = true;
      }

      if (!isLength(phoneNumber, 0, 10)) {
        setValidationMessage(
          'phone nuber should be 10 numbers!',
          'error',
          setTimeOutId,
          validationMessageTags.phoneNumberVMTag
        );

        errorFlag = true;
      }

      if (isAlpha(phoneNumber, ['en-IN'])) {
        setValidationMessage(
          'invalid, alphabates not allowd!',
          'error',
          setTimeOutId,
          validationMessageTags.phoneNumberVMTag
        );

        errorFlag = true;
      }

      if (!isMobilePhone(phoneNumber, ['en-IN'])) {
        setValidationMessage(
          'invalid, phone number!',
          'error',
          setTimeOutId,
          validationMessageTags.phoneNumberVMTag
        );

        errorFlag = true;
      }
    }

    return errorFlag;
  };

  const { updatePostsDocFields } = usePostsOperation();
  const { updateCommentPostFields } = useCommentOperation();

  const updateInfoInFirebase = async (doesErrorExists) => {
    if (!doesErrorExists) {
      setLoading(true);

      try {
        await updateUserDoc(userInfo, id);

        if (info.userName !== userInfo.userName) {
          await updatePostsDocFields('userId', '==', id, {
            userName: userInfo.userName,
          });

          await updateCommentPostFields('userId', '==', id, {
            userName: userInfo.userName,
          });

          // Update user name in notifications
          const notfiRef = collection(firestoreInstance, 'notifications');

          const q = query(notfiRef, where('whoMade.userId', '==', id));
          const notifiSnap = await getDocs(q);

          notifiSnap.forEach(async (n) => {
            const { userDpUrl, userId } = n.get('whoMade');

            await updateDoc(doc(firestoreInstance, 'notifications', n.id), {
              whoMade: { userName: userInfo.userName, userDpUrl, userId },
            });
          });
          // Update user name in notifications ends
        }

        setGender(gender);

        await getUpdatedUserDoc(id);

        setLoading(false);

        dispatch(
          notificationShowSuccess({
            msg: 'successfully updated information!!!',
          })
        );
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        setLoading(false);
      }
    }
  };

  const handleUpdateInfo = () => {
    if (
      userInfo.bio === info.bio &&
      userInfo.website === info.website &&
      userInfo.fullName === info.fullName &&
      userInfo.userName === info.userName &&
      userInfo.phoneNumber === info.phoneNumber
    ) {
      dispatch(notificationShowInfo({ msg: 'Sorry nothing to update!' }));
    } else {
      const error = validateUserInfo();
      if (!error) updateInfoInFirebase(error);
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
    handleUpdateInfo,
    loading,
  };
};

export default useEditAccount;
