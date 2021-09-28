import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { firestoreInstance } from '../config/firebase';
import { notificationShowError } from '../features/notification';
import { updateInfo, userLoadingEnds } from '../features/user';

const useUserOperation = () => {
  const dispatch = useDispatch();

  const getUpdatedUserDoc = async (docId) => {
    try {
      const userDocRef = doc(firestoreInstance, 'users', docId);

      const docSnap = await getDoc(userDocRef);
      dispatch(updateInfo(docSnap.data()));
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      dispatch(userLoadingEnds());
    }
  };
  
  const updateUserDoc = async (data, docId) => {
    try {
      const userDocRef = doc(firestoreInstance, 'users', docId);

      await updateDoc(userDocRef, data);
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      dispatch(userLoadingEnds());
    }
  };

  return { getUpdatedUserDoc, updateUserDoc };
};

export default useUserOperation;
