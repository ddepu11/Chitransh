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

      const userSnapshot = await getDocs(q);

      userSnapshot.forEach((u) => {
        info.following.forEach((folId) => {
          if (folId === u.get('userId')) {
            posts.push(u.data());
          }
        });

        // When useer's following array is empty
        if (u.get('userId') === id) {
          posts.push(u.data());
        }

        if (index === userSnapshot.size - 1) {
          dispatch(storeAllPosts(posts));
        }

        index += 1;
      });
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
