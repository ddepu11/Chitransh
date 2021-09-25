import {
  collection,
  getDocs,
  updateDoc,
  where,
  query,
  doc,
} from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { firestoreInstance } from '../config/firebase';
import { notificationShowError } from '../features/notification';
import { userLoadingEnds } from '../features/user';

const useCommentOperation = () => {
  const dispatch = useDispatch();

  const commentsCollectionReference = collection(firestoreInstance, 'comments');

  const updateCommentPostFields = async (
    fieldName,
    operator,
    value,
    dataToUpdate
  ) => {
    try {
      const q = query(
        commentsCollectionReference,
        where(fieldName, operator, value)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (c) => {
        await updateDoc(doc(firestoreInstance, 'comments', c.id), dataToUpdate);
      });
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      dispatch(userLoadingEnds());
    }
  };

  return { updateCommentPostFields };
};

export default useCommentOperation;
