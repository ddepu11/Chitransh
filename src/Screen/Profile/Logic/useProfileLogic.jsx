import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { useHistory } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestoreInstance, storage } from '../../../config/firebase';
import {
  notificationShowError,
  notificationShowSuccess,
} from '../../../features/notification';
import {
  updateInfo,
  userLoadingBegins,
  userLoadingEnds,
} from '../../../features/user';

const useProfileLogic = () => {
  const dispatch = useDispatch();

  const { info, id, userLoading } = useSelector((state) => state.user.value);
  const [handlingChangeDp, setHandlingChangeDp] = useState(false);

  // #@@#@#@#@#@@## All Dp Related #$#$$#$#$#$#$##$#$
  const openChangeDpDialog = () => {
    setHandlingChangeDp(true);
  };

  const cancelChangeDp = () => {
    setHandlingChangeDp(false);
  };

  const closeDialog = (e) => {
    if (e.target.matches('.ChangeDpDialog')) {
      cancelChangeDp();
    }
  };

  // If Display was never set
  const uploadPicAndUpdateUserDoc = async (imageToUpload) => {
    const randomlyGeneratedName = `${info.email}_${Math.floor(
      Math.random() * Date.now()
    )}`;

    const dpStorageRef = ref(
      storage,
      `display_pictures/${randomlyGeneratedName}`
    );

    try {
      await uploadBytes(dpStorageRef, imageToUpload);
      const downloadURL = await getDownloadURL(dpStorageRef);

      await setDoc(
        doc(firestoreInstance, 'users', id),
        {
          dp: {
            fileName: randomlyGeneratedName,
            url: downloadURL,
          },
        },
        { merge: true }
      );

      const userDocRef = doc(firestoreInstance, 'users', id);
      const docSnap = await getDoc(userDocRef);

      dispatch(updateInfo(docSnap.data()));

      dispatch(userLoadingEnds());

      dispatch(
        notificationShowSuccess({
          msg: 'Successfully changed display picture!',
        })
      );
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      dispatch(userLoadingEnds());
    }
  };

  // If Display is once set
  const deletePreviousDpAndUploadNewOne = async (imageToUpload) => {
    const randomlyGeneratedName = `${info.email}_${Math.floor(
      Math.random() * Date.now()
    )}`;

    const previousDpRef = ref(storage, `display_pictures/${info.dp.fileName}`);

    const newDpRef = ref(storage, `display_pictures/${randomlyGeneratedName}`);

    try {
      await deleteObject(previousDpRef);

      await uploadBytes(newDpRef, imageToUpload);

      const downloadURL = await getDownloadURL(newDpRef);

      await setDoc(
        doc(firestoreInstance, 'users', id),
        {
          dp: {
            fileName: randomlyGeneratedName,
            url: downloadURL,
          },
        },
        { merge: true }
      );

      const userDocRef = doc(firestoreInstance, 'users', id);
      const docSnap = await getDoc(userDocRef);

      dispatch(updateInfo(docSnap.data()));

      dispatch(
        notificationShowSuccess({ msg: 'Successfully uploaded new dp' })
      );
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      dispatch(userLoadingEnds());
    }
  };

  const handleDpChange = (e) => {
    cancelChangeDp();
    const { files } = e.target;
    const imageToUpload = Array.from(files)[0];

    if (info.dp.fileName === 'dummyDp') {
      dispatch(userLoadingBegins());
      uploadPicAndUpdateUserDoc(imageToUpload);
    } else {
      dispatch(userLoadingBegins());
      deletePreviousDpAndUploadNewOne(imageToUpload);
    }
  };

  const removeDp = async () => {
    cancelChangeDp();
    const dpRef = ref(storage, `display_pictures/${info.dp.fileName}`);

    dispatch(userLoadingBegins());

    try {
      await deleteObject(dpRef);

      await setDoc(
        doc(firestoreInstance, 'users', id),
        {
          dp: {
            fileName: 'dummyDp',
            url: '',
          },
        },
        { merge: true }
      );

      const userDocRef = doc(firestoreInstance, 'users', id);
      const docSnap = await getDoc(userDocRef);

      dispatch(updateInfo(docSnap.data()));

      dispatch(notificationShowSuccess({ msg: 'Successfully removed  dp!' }));
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      dispatch(userLoadingEnds());
    }
  };
  // #@@#@#@#@#@@## All Dp Related Ends #$#$$#$#$#$#$##$#$

  // handling nav
  const history = useHistory();
  const postsLinkRef = useRef(null);
  const savedLinkRef = useRef(null);

  useEffect(() => {
    if (history.location.pathname === '/ddepu11@gmail.com/') {
      postsLinkRef.current.classList.add('active');
      savedLinkRef.current.classList.remove('active');
    } else {
      postsLinkRef.current.classList.remove('active');
      savedLinkRef.current.classList.add('active');
    }
  }, [history.location.pathname]);

  return {
    info,
    openChangeDpDialog,
    handlingChangeDp,
    cancelChangeDp,
    handleDpChange,
    userLoading,
    removeDp,
    closeDialog,
    postsLinkRef,
    savedLinkRef,
  };
};

export default useProfileLogic;
