import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  doc,
  arrayUnion,
  arrayRemove,
  collection,
  getDocs,
  updateDoc,
  where,
  query,
} from 'firebase/firestore';
import { firestoreInstance } from '../../../config/firebase';
import {
  notificationShowError,
  notificationShowSuccess,
} from '../../../features/notification';
import usePostsOperation from '../../usePostsOperation';
import useUserOperation from '../../useUserOperations';

const usePostLogic = (post) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { id, info } = useSelector((state) => state.user.value);

  const { createdOn, images } = post;

  // Calculating when was the post was created
  const currentTimeInMs = new Date().getTime() - createdOn;

  // 1s  = 1000ms
  // 1m  = 60 * 1000
  // 1hr = 60 * 60 * 1000
  // 1day =  24 *60 * 60 *1000

  const msInAMinute = 60 * 1000;
  const msInAHour = 60 * 60 * 1000;
  const msInADay = 24 * 60 * 60 * 1000;

  const days = Math.floor(currentTimeInMs / msInADay);
  const hours = Math.floor((currentTimeInMs % msInADay) / msInAHour);
  const minutes = Math.floor((currentTimeInMs % msInAHour) / msInAMinute);
  const seconds = Math.floor((currentTimeInMs % msInAMinute) / 1000);

  let whenWasThePostCreated = ``;

  if (seconds !== 0) {
    whenWasThePostCreated = `${seconds}s ago`;
  }

  if (minutes !== 0) {
    whenWasThePostCreated = `${minutes}m ago`;
  }

  if (hours !== 0) {
    whenWasThePostCreated = `${hours}h ago`;
  }

  if (days !== 0) {
    whenWasThePostCreated = `${days}d ago`;
  }
  // ################## Calculating when was the post created  Ends #####################

  // Navigate through images if there are more then 1 image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const showPreviousImage = () => {
    if (currentImageIndex === 0) {
      setCurrentImageIndex(images.length - 1);
    } else {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevState) => {
      if (prevState === images.length - 1) {
        return 0;
      } else {
        return prevState + 1;
      }
    });
  };
  // ########################## Navigate through images ends #############################

  // like/dislike Post
  const { updatePostsDocFields, getUpdatedPosts } = usePostsOperation();
  const { getUpdatedUserDoc } = useUserOperation(id);

  let didYouLikedThePost = false;

  if (info.likedPostsIds.filter((item) => item === post.id).length === 1) {
    didYouLikedThePost = true;
  }

  const likeThePost = async () => {
    if (!didYouLikedThePost) {
      setLoading(true);

      try {
        const userDocRef = doc(firestoreInstance, 'users', id);

        await updateDoc(userDocRef, { likedPostsIds: arrayUnion(post.id) });

        await updatePostsDocFields('id', '==', post.id, {
          likes: post.likes + 1,
        });

        await getUpdatedUserDoc();

        await getUpdatedPosts();

        setLoading(false);

        dispatch(
          notificationShowSuccess({ msg: 'Successfully liked the post!' })
        );
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        setLoading(false);
      }
    }
  };

  const dislikeThePost = async () => {
    if (didYouLikedThePost) {
      setLoading(true);

      try {
        const userDocRef = doc(firestoreInstance, 'users', id);

        await updateDoc(userDocRef, { likedPostsIds: arrayRemove(post.id) });

        await updatePostsDocFields('id', '==', post.id, {
          likes: post.likes - 1,
        });

        await getUpdatedUserDoc();

        await getUpdatedPosts();

        setLoading(false);

        dispatch(
          notificationShowSuccess({ msg: 'Successfully disliked the post!' })
        );
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        setLoading(false);
      }
    }
  };
  // ############################### like/dislike Post ends #####################################

  // Saving/Unsaving Post
  let didYouSavedThePost = false;

  if (info.savedPostsIds.filter((item) => item === post.id).length === 1) {
    didYouSavedThePost = true;
  }

  const savePost = async () => {
    if (!didYouSavedThePost) {
      setLoading(true);

      try {
        const userDocRef = doc(firestoreInstance, 'users', id);

        await updateDoc(userDocRef, { savedPostsIds: arrayUnion(post.id) });

        await getUpdatedUserDoc();

        setLoading(false);

        dispatch(
          notificationShowSuccess({ msg: 'Successfully saved the post!' })
        );
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        setLoading(false);
      }
    }
  };

  const unSavePost = async () => {
    if (didYouSavedThePost) {
      setLoading(true);

      try {
        const userDocRef = doc(firestoreInstance, 'users', id);

        await updateDoc(userDocRef, { savedPostsIds: arrayRemove(post.id) });

        await getUpdatedUserDoc();

        setLoading(false);
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        setLoading(false);
      }
    }
  };
  // ################################ Saving/Unsaving Post Ends ###################################

  const [comment, setComment] = useState('');

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const postComment = async () => {
    setLoading(true);
    const finalComment = {
      userName: info.userName,
      userId: id,
      userDpUrl: info.dp.url,
      comment,
    };

    try {
      const postsCollectionReference = collection(firestoreInstance, 'posts');

      const q = query(postsCollectionReference, where('id', '==', post.id));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (p) => {
        await updateDoc(doc(firestoreInstance, 'posts', p.id), {
          comments: arrayUnion(finalComment),
        });
      });

      setComment('');

      await getUpdatedPosts();

      dispatch(notificationShowSuccess({ msg: 'successfully commented!' }));
      setLoading(false);
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      setComment('');
      setLoading(false);
    }
  };

  return {
    loading,
    unSavePost,
    savePost,
    dislikeThePost,
    didYouSavedThePost,
    likeThePost,
    didYouLikedThePost,
    showNextImage,
    showPreviousImage,
    whenWasThePostCreated,
    currentImageIndex,
    comment,
    postComment,
    handleComment,
  };
};

export default usePostLogic;
