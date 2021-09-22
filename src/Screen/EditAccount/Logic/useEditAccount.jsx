import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

  const closeDialogBox = () => setHandlingChangeGender(false);
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
    info,
    userLoading,
  };
};

export default useEditAccount;
