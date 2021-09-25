import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { firestoreInstance } from '../config/firebase';
import { updateInfo } from '../features/user';

const useUserOperation = (docId) => {
  const dispatch = useDispatch();

  const getUpdatedUserDoc = async () => {
    const userDocRef = doc(firestoreInstance, 'users', docId);
    const docSnap = await getDoc(userDocRef);

    dispatch(updateInfo(docSnap.data()));
  };

  const updateUserDoc = async (data) => {
    await updateDoc(doc(firestoreInstance, 'users', docId), data);
  };

  return { getUpdatedUserDoc, updateUserDoc };
};

export default useUserOperation;
