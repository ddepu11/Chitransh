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
import { storeAllPosts } from '../features/posts';

const usePostsOperation = (userIdInPostDocs) => {
  const dispatch = useDispatch();

  const postsCollectionReference = collection(firestoreInstance, 'posts');

  const getUpdatedPosts = async () => {
    const postsSnapshot = await getDocs(postsCollectionReference);

    let index = 0;

    const posts = [];

    postsSnapshot.forEach((p) => {
      posts.push(p.data());

      if (index === postsSnapshot.size - 1) {
        dispatch(storeAllPosts(posts));
      }

      index += 1;
    });
  };

  const updatePostsDocFields = async (dataToUpdate) => {
    const q = query(
      postsCollectionReference,
      where('userId', '==', userIdInPostDocs)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (p) => {
      await updateDoc(doc(firestoreInstance, 'posts', p.id), dataToUpdate);
    });
  };

  return { getUpdatedPosts, updatePostsDocFields };
};

export default usePostsOperation;
