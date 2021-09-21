import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
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

  const openChangeDpDialog = () => {
    setHandlingChangeDp(true);
  };

  const cancelChangeDp = () => {
    setHandlingChangeDp(false);
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

      dispatch(userLoadingEnds());

      dispatch(
        notificationShowSuccess({
          msg: 'Successfully chnaged display picture!',
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

      console.log(docSnap.data());

      dispatch(updateInfo(docSnap.data()));

      // dispatch(
      //   notificationShowSuccess({ msg: 'Successfully uploaded new dp' })
      // );
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

  return {
    info,
    openChangeDpDialog,
    handlingChangeDp,
    cancelChangeDp,
    handleDpChange,
    userLoading,
  };
};

export default useProfileLogic;
