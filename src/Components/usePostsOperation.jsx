import { collection, getDocs } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { firestoreInstance } from '../config/firebase';
import { storeAllPosts } from '../features/posts';

const usePostsOperation = () => {
  const dispatch = useDispatch();

  const getUpdatedPosts = async () => {
    const postsSnapshot = await getDocs(collection(firestoreInstance, 'posts'));

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

  return { getUpdatedPosts };
};

export default usePostsOperation;
