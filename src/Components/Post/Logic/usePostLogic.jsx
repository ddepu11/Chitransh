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
  notificationShowInfo,
  notificationShowSuccess,
} from '../../../features/notification';
import usePostsOperation from '../../usePostsOperation';
import useUserOperation from '../../useUserOperations';
import useNotificationOperations from '../../useNotificationOperations';
import { closePost } from '../../../features/post';
import { clearPosts, postsLoadingBegins } from '../../../features/posts';

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
  const msInAWeek = msInADay * 7;

  const week = Math.floor(currentTimeInMs / msInAWeek);
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

  if (week !== 0) {
    whenWasThePostCreated = `${week}w ago`;
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
  const { updatePostsDocFields } = usePostsOperation();

  const { getUpdatedUserDoc } = useUserOperation();

  const { sendNotification } = useNotificationOperations(id);

  let didYouLikedThePost = false;

  if (info && info.likedPostsIds.includes(post.id)) {
    didYouLikedThePost = true;
  }

  const [likePostLoading, setLikePostLoading] = useState(false);

  const likeThePost = async () => {
    if (!didYouLikedThePost) {
      setLikePostLoading(true);

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

        setLikePostLoading(false);

        dispatch(
          notificationShowSuccess({ msg: 'Successfully liked the post!' })
        );
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        setLikePostLoading(false);
      }
    }
  };

  const dislikeThePost = async () => {
    if (didYouLikedThePost) {
      setLikePostLoading(true);

      try {
        const userDocRef = doc(firestoreInstance, 'users', id);

        await updateDoc(userDocRef, { likedPostsIds: arrayRemove(post.id) });

        await updatePostsDocFields('id', '==', post.id, {
          likes: post.likes - 1,
        });

        await getUpdatedUserDoc(id);

        setLikePostLoading(false);

        dispatch(
          notificationShowSuccess({ msg: 'Successfully disliked the post!' })
        );
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        setLikePostLoading(false);
      }
    }
  };

  // ############################### like/dislike Post ends #####################################

  // Saving/Unsaving Post
  let didYouSavedThePost = false;

  if (info && info.savedPostsIds.includes(post.id)) {
    didYouSavedThePost = true;
  }

  const [savePostLoading, setSavePostLoading] = useState(false);

  const savePost = async () => {
    if (!didYouSavedThePost) {
      setSavePostLoading(true);

      try {
        const userDocRef = doc(firestoreInstance, 'users', id);

        await updateDoc(userDocRef, { savedPostsIds: arrayUnion(post.id) });

        await getUpdatedUserDoc(id);

        setSavePostLoading(false);

        dispatch(
          notificationShowSuccess({ msg: 'Successfully saved the post!' })
        );
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        setSavePostLoading(false);
      }
    }
  };

  const unSavePost = async () => {
    if (didYouSavedThePost) {
      setSavePostLoading(true);

      try {
        const userDocRef = doc(firestoreInstance, 'users', id);

        await updateDoc(userDocRef, { savedPostsIds: arrayRemove(post.id) });

        await getUpdatedUserDoc(id);

        setSavePostLoading(false);
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        setSavePostLoading(false);
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
    if (comment.trim().length === 0) {
      dispatch(notificationShowError({ msg: 'Comment is empty!' }));

      setComment('');
    } else {
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
    }
  };

  // Fetch comments
  useEffect(() => {
    let mounted = true;

    const getComments = async () => {
      const newComments = [];

      post.comments.forEach(async (item, index) => {
        const commentRef = doc(firestoreInstance, 'comments', item);

        const cmtSnap = await getDoc(commentRef);

        if (cmtSnap.exists()) {
          newComments.push(cmtSnap.data());
        }

        if (index === post.comments.length - 1) {
          if (mounted) setComments(newComments);
        }
      });
    };

    if (post.comments.length !== 0 && comments.length === 0) {
      getComments();
    }

    return () => {
      mounted = false;
    };
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

  const closeViewPost = () => {
    dispatch(closePost());
    document.body.classList.remove('dialog_active');
  };

  const unfollowAPerson = async (e) => {
    closeDialog();
    dispatch(postsLoadingBegins());

    const personDocId = e.target.getAttribute('data-value');

    try {
      // Removing my id from person's followers array whom you  gonna unfollow
      await updateDoc(doc(firestoreInstance, 'users', personDocId), {
        followers: arrayRemove(id),
      });

      // Remove person's id whom you gonna unfollow, from my following array
      const userRef = doc(firestoreInstance, 'users', id);

      await updateDoc(userRef, {
        following: arrayRemove(personDocId),
      });

      setTimeout(async () => {
        dispatch(clearPosts());

        await getUpdatedUserDoc(id);

        // await getUpdatedPosts(info, id);

        dispatch(notificationShowInfo({ msg: 'Unfollowed a person!' }));
      }, 1000);
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      setLoading(false);
    }
  };

  const [
    amIFollowingThePersonWhoCreatedThisPost,
    setAmIFollowingThePersonWhoCreatedThisPost,
  ] = useState(false);

  // Check that is logged in user following profile person
  useEffect(() => {
    if (info) {
      if (info.following.includes(post.userId)) {
        setAmIFollowingThePersonWhoCreatedThisPost(true);
      } else {
        setAmIFollowingThePersonWhoCreatedThisPost(false);
      }

      if (info.following.length === 0) {
        setAmIFollowingThePersonWhoCreatedThisPost(false);
      }
    }
  }, [info, post.userId]);

  return {
    id,
    unfollowAPerson,
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
    closeViewPost,
    amIFollowingThePersonWhoCreatedThisPost,
    savePostLoading,
    likePostLoading,
  };
};

export default usePostLogic;
