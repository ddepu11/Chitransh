import {
  collection,
  getDocs,
  updateDoc,
  where,
  query,
  doc,
  orderBy,
} from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { firestoreInstance } from '../config/firebase';
import { notificationShowError } from '../features/notification';
import { postsLoadingEnds, storeAllPosts } from '../features/posts';

const usePostsOperation = () => {
  const dispatch = useDispatch();

  const postsCollectionReference = collection(firestoreInstance, 'posts');

  const getUpdatedPosts = async (info, id) => {
    try {
      const userCollection = collection(firestoreInstance, 'posts');

      let index = 0;
      const posts = [];

      const q = query(userCollection, orderBy('createdOn', 'desc'));

      const postsSnap = await getDocs(q);

      postsSnap.forEach((u) => {
        info.following.forEach((folId) => {
          if (folId === u.get('userId')) {
            posts.push(u.data());
          }
        });

        // Getting user's own posts array is empty
        if (u.get('userId') === id) {
          posts.push(u.data());
        }

        if (index === postsSnap.size - 1) {
          dispatch(storeAllPosts(posts));
        }

        index += 1;
      });

      if (postsSnap.size === 0) {
        dispatch(postsLoadingEnds());
      }
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      dispatch(postsLoadingEnds());
    }
  };

  const updatePostsDocFields = async (
    fieldName,
    operator,
    value,
    dataToUpdate
  ) => {
    const q = query(
      postsCollectionReference,
      where(fieldName, operator, value)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (p) => {
      await updateDoc(doc(firestoreInstance, 'posts', p.id), dataToUpdate);
    });
  };

  return { getUpdatedPosts, updatePostsDocFields };
};

export default usePostsOperation;
