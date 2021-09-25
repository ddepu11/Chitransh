import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doc, arrayUnion, updateDoc, arrayRemove } from 'firebase/firestore';
import { firestoreInstance } from '../../../config/firebase';
import {
  notificationShowError,
  notificationShowSuccess,
} from '../../../features/notification';
import { userLoadingBegins, userLoadingEnds } from '../../../features/user';
import usePostsOperation from '../../usePostsOperation';
import useUserOperation from '../../useUserOperations';

const usePostLogic = (post) => {
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
      dispatch(userLoadingBegins());

      try {
        const userDocRef = doc(firestoreInstance, 'users', id);

        await updateDoc(userDocRef, { likedPostsIds: arrayUnion(post.id) });

        await updatePostsDocFields('id', '==', post.id, {
          likes: post.likes + 1,
        });

        await getUpdatedUserDoc();

        await getUpdatedPosts();

        dispatch(userLoadingEnds());

        dispatch(
          notificationShowSuccess({ msg: 'Successfully liked the song!' })
        );
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        dispatch(userLoadingEnds());
      }
    }
  };

  const dislikeThePost = async () => {
    if (didYouLikedThePost) {
      dispatch(userLoadingBegins());

      try {
        const userDocRef = doc(firestoreInstance, 'users', id);

        await updateDoc(userDocRef, { likedPostsIds: arrayRemove(post.id) });

        await updatePostsDocFields('id', '==', post.id, {
          likes: post.likes - 1,
        });

        await getUpdatedUserDoc();

        await getUpdatedPosts();

        dispatch(userLoadingEnds());

        dispatch(
          notificationShowSuccess({ msg: 'Successfully disliked the song!' })
        );
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        dispatch(userLoadingEnds());
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
      dispatch(userLoadingBegins());

      try {
        const userDocRef = doc(firestoreInstance, 'users', id);

        await updateDoc(userDocRef, { savedPostsIds: arrayUnion(post.id) });

        await getUpdatedUserDoc();

        dispatch(userLoadingEnds());

        dispatch(
          notificationShowSuccess({ msg: 'Successfully saved the song!' })
        );
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        dispatch(userLoadingEnds());
      }
    }
  };

  const unSavePost = async () => {
    if (didYouSavedThePost) {
      dispatch(userLoadingBegins());

      try {
        const userDocRef = doc(firestoreInstance, 'users', id);

        await updateDoc(userDocRef, { savedPostsIds: arrayRemove(post.id) });

        await getUpdatedUserDoc();

        dispatch(userLoadingEnds());
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        dispatch(userLoadingEnds());
      }
    }
  };
  // ################################ Saving/Unsaving Post Ends ###################################

  const [comment, setComment] = useState('');

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const postComment = () => {
    console.log(comment);
  };

  return {
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
