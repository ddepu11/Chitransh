import { useEffect, useState } from 'react';
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
  addDoc,
  getDoc,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { firestoreInstance } from '../../../config/firebase';
import {
  notificationShowError,
  notificationShowSuccess,
} from '../../../features/notification';
import usePostsOperation from '../../usePostsOperation';
import useUserOperation from '../../useUserOperations';
import useNotificationOperations from '../../useNotificationOperations';

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
  const { getUpdatedUserDoc } = useUserOperation();

  const { sendNotification } = useNotificationOperations(id);

  let didYouLikedThePost = false;

  if (
    info &&
    info.likedPostsIds.filter((item) => item === post.id).length === 1
  ) {
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

        // Notfication
        const notification = {
          body: `liked your post`,
          sendToUserId: post.userId,
          whoMade: {
            userName: info.userName,
            userId: id,
            userDpUrl: info.dp.url,
          },
          postId: post.id,
          postImg: post.images[0].url,
          createdOn: Date.now(),
        };

        if (post.userId !== id) {
          sendNotification(post.userId, notification);
        }

        // Notification ends

        await getUpdatedUserDoc(id);

        await getUpdatedPosts(info, id);

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

        await getUpdatedUserDoc(id);

        await getUpdatedPosts(info, id);

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

  if (
    info &&
    info.savedPostsIds.filter((item) => item === post.id).length === 1
  ) {
    didYouSavedThePost = true;
  }

  const savePost = async () => {
    if (!didYouSavedThePost) {
      setLoading(true);

      try {
        const userDocRef = doc(firestoreInstance, 'users', id);

        await updateDoc(userDocRef, { savedPostsIds: arrayUnion(post.id) });

        await getUpdatedUserDoc(id);

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

        await getUpdatedUserDoc(id);

        setLoading(false);
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        setLoading(false);
      }
    }
  };

  // ################################ Saving/Unsaving Post Ends ###################################

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const postComment = async () => {
    setLoading(true);

    const finalComment = {
      id: uuidv4(),
      userName: info.userName,
      userId: id,
      userDpUrl: info.dp.url,
      comment,
      createdOn: Date.now(),
    };

    try {
      // add comment doc
      const commentRef = await addDoc(
        collection(firestoreInstance, 'comments'),
        finalComment
      );

      // Add comment id in post's comment array
      const postsCollectionReference = collection(firestoreInstance, 'posts');
      const q = query(postsCollectionReference, where('id', '==', post.id));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (p) => {
        await updateDoc(doc(firestoreInstance, 'posts', p.id), {
          comments: arrayUnion(commentRef.id),
        });
      });

      // $%$$#$#$##$#$# Seperation #$#$$##$##$#
      // Get that comment add it to comments array of state
      const docRef = doc(firestoreInstance, 'comments', commentRef.id);
      const commentSnap = await getDoc(docRef);

      if (commentSnap.exists()) {
        setComments((prevState) => [...prevState, commentSnap.data()]);
      }

      const notification = {
        body: `commented on your post: ${comment}`,
        sendToUserId: post.userId,
        whoMade: {
          userName: info.userName,
          userId: id,
          userDpUrl: info.dp.url,
        },
        postId: post.id,
        postImg: post.images[0].url,
        createdOn: Date.now(),
      };

      if (post.userId !== id) {
        sendNotification(post.userId, notification);
      }

      setComment('');
      dispatch(notificationShowSuccess({ msg: 'successfully commented!' }));
      setLoading(false);
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      setComment('');
      setLoading(false);
    }
  };

  // Fetch comments
  useEffect(() => {
    const getComments = async () => {
      const newComments = [];

      post.comments.forEach(async (item, index) => {
        const commentRef = doc(firestoreInstance, 'comments', item);

        const cmtSnap = await getDoc(commentRef);

        if (cmtSnap.exists()) {
          newComments.push(cmtSnap.data());
        }

        if (index === post.comments.length - 1) {
          setComments(newComments);
        }
      });
    };

    if (post.comments.length !== 0 && comments.length === 0) {
      getComments();
    }
  }, [comments.length, post.comments]);

  const [showDialog, setShowDialog] = useState(false);

  const closeDialog = () => {
    setShowDialog(false);
    document.body.classList.remove('dialog_active');
  };

  const openDialog = () => {
    document.body.classList.add('dialog_active');
    setShowDialog(true);
  };

  return {
    id,
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
    comments,
    postComment,
    handleComment,
    showDialog,
    closeDialog,
    openDialog,
  };
};

export default usePostLogic;
