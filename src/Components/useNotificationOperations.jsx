import {
  doc,
  arrayUnion,
  updateDoc,
  addDoc,
  collection,
  query,
  getDocs,
  where,
} from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { firestoreInstance } from '../config/firebase';
import { notificationShowError } from '../features/notification';

const useNotificationOperations = () => {
  const dispatch = useDispatch();

  const sendNotification = async (userId, notification) => {
    try {
      // Add notification doc
      const notificationRef = await addDoc(
        collection(firestoreInstance, 'notifications'),
        notification
      );

      // Add notification id in user's notification array
      const usersRef = collection(firestoreInstance, 'users');

      const q = query(usersRef, where('id', '==', userId));

      const usersSnap = await getDocs(q);

      usersSnap.forEach(async (u) => {
        await updateDoc(doc(firestoreInstance, 'users', u.id), {
          notifications: arrayUnion(notificationRef.id),
        });
      });
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
    }
  };

  return { sendNotification };
};

export default useNotificationOperations;
