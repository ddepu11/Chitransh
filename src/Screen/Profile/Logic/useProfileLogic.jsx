import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  arrayRemove,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { useHistory, useParams } from 'react-router-dom';

import { firestoreInstance, storage } from '../../../config/firebase';
import {
  notificationShowError,
  notificationShowInfo,
  notificationShowSuccess,
} from '../../../features/notification';
import { userLoadingBegins, userLoadingEnds } from '../../../features/user';
import useUserOperation from '../../../Components/useUserOperations';
import usePostsOperation from '../../../Components/usePostsOperation';
import useCommentOperation from '../../../Components/useCommentOperation';
import useNotificationOperations from '../../../Components/useNotificationOperations';

const useProfileLogic = () => {
  const dispatch = useDispatch();

  const [profile, setProfile] = useState({});
  const [personPosts, setPersonPosts] = useState([]);

  const { userId } = useParams();

  const { info, id, userLoading } = useSelector((state) => state.user.value);

  const [loading, setLoading] = useState(true);

  // Runs When viewing someone profile
  useEffect(() => {
    setLoading(true);

    const getPosts = async () => {
      const q = query(
        collection(firestoreInstance, 'posts'),
        where('userId', '==', userId)
      );
      const myPostsSnap = await getDocs(q);
      const newPosts = [];
      let index = 0;

      myPostsSnap.forEach((p) => {
        newPosts.push(p.data());

        if (index === myPostsSnap.size - 1) {
          setPersonPosts(newPosts.sort((a, b) => b.createdOn - a.createdOn));
          setLoading(false);
        }

        index += 1;
      });

      if (myPostsSnap.size === 0) {
        setLoading(false);
        setPersonPosts(newPosts);
      }
    };

    const fetchProfile = async () => {
      const docRef = doc(firestoreInstance, 'users', userId);
      const userSnap = await getDoc(docRef);

      if (userSnap.exists()) {
        setProfile({ ...userSnap.data(), personDocId: userSnap.id });
        getPosts();
      }
    };

    if (userId) {
      fetchProfile();
    } else {
      setProfile({});
      setPersonPosts([]);
    }
  }, [userId]);

  const [handlingChangeDp, setHandlingChangeDp] = useState(false);

  // #@@#@#@#@#@@## All Dp Related #$#$$#$#$#$#$##$#$
  const openChangeDpDialog = () => {
    setHandlingChangeDp(true);
    document.body.classList.add('dialog_active');
  };

  const cancelChangeDp = () => {
    setHandlingChangeDp(false);
    document.body.classList.remove('dialog_active');
  };

  const closeDialog = (e) => {
    if (e.target.matches('.ChangeDpDialog')) {
      cancelChangeDp();
    }
  };

  const { getUpdatedUserDoc, updateUserDoc } = useUserOperation();

  const { updatePostsDocFields } = usePostsOperation();
  const { updateCommentPostFields } = useCommentOperation();

  // If Display was never set
  const uploadPicAndUpdateUserDoc = async (imageToUpload) => {
    const randomlyGeneratedName = `${info.email}_${Math.floor(
      Math.random() * Date.now()
    )}`;

    const dpStorageRef = ref(
      storage,
      `display_pictures/${randomlyGeneratedName}`
    );

    try {
      await uploadBytes(dpStorageRef, imageToUpload);
      const downloadURL = await getDownloadURL(dpStorageRef);

      await updateUserDoc(
        {
          dp: {
            fileName: randomlyGeneratedName,
            url: downloadURL,
          },
        },
        id
      );

      await updatePostsDocFields('userId', '==', id, {
        userDpUrl: downloadURL,
      });

      await updateCommentPostFields('userId', '==', id, {
        userDpUrl: downloadURL,
      });

      // Update userDpUrl  in notifications
      const notfiRef = collection(firestoreInstance, 'notifications');

      const q = query(notfiRef, where('whoMade.userId', '==', id));
      const notifiSnap = await getDocs(q);

      notifiSnap.forEach(async (n) => {
        const { userId: nUID, userName } = n.get('whoMade');

        await updateDoc(doc(firestoreInstance, 'notifications', n.id), {
          whoMade: { userName, userDpUrl: downloadURL, userId: nUID },
        });
      });
      // Update userDpUrl in notifications ends

      await getUpdatedUserDoc(id);

      // await getUpdatedPosts(info, id);

      dispatch(
        notificationShowSuccess({
          msg: 'Successfully changed display picture!',
        })
      );
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      dispatch(userLoadingEnds());
    }
  };

  // If Display is once set
  const deletePreviousDpAndUploadNewOne = async (imageToUpload) => {
    const randomlyGeneratedName = `${info.email}_${Math.floor(
      Math.random() * Date.now()
    )}`;

    const previousDpRef = ref(storage, `display_pictures/${info.dp.fileName}`);

    const newDpRef = ref(storage, `display_pictures/${randomlyGeneratedName}`);

    try {
      await deleteObject(previousDpRef);

      await uploadBytes(newDpRef, imageToUpload);

      const downloadURL = await getDownloadURL(newDpRef);

      // Updating user Doc
      await updateUserDoc(
        {
          dp: {
            fileName: randomlyGeneratedName,
            url: downloadURL,
          },
        },
        id
      );

      // $##$#$#$#$#$#$ Update useDpUrl field in all his posts ##############
      await updatePostsDocFields('userId', '==', id, {
        userDpUrl: downloadURL,
      });

      await updateCommentPostFields('userId', '==', id, {
        userDpUrl: downloadURL,
      });

      // Update userDpUrl  in notifications
      const notfiRef = collection(firestoreInstance, 'notifications');

      const q = query(notfiRef, where('whoMade.userId', '==', id));
      const notifiSnap = await getDocs(q);

      notifiSnap.forEach(async (n) => {
        const { userId: nUID, userName } = n.get('whoMade');

        await updateDoc(doc(firestoreInstance, 'notifications', n.id), {
          whoMade: { userName, userDpUrl: downloadURL, userId: nUID },
        });
      });
      // Update userDpUrl in notifications ends

      await getUpdatedUserDoc(id);

      // await getUpdatedPosts(info, id);

      dispatch(
        notificationShowSuccess({ msg: 'Successfully uploaded new dp' })
      );
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      dispatch(userLoadingEnds());
    }
  };

  const handleDpChange = (e) => {
    cancelChangeDp();
    const { files } = e.target;
    const imageToUpload = Array.from(files)[0];

    if (info.dp.fileName === 'dummyDp') {
      dispatch(userLoadingBegins());
      uploadPicAndUpdateUserDoc(imageToUpload);
    } else {
      dispatch(userLoadingBegins());
      deletePreviousDpAndUploadNewOne(imageToUpload);
    }
  };

  const removeDp = async () => {
    cancelChangeDp();
    const dpRef = ref(storage, `display_pictures/${info.dp.fileName}`);

    dispatch(userLoadingBegins());

    try {
      await deleteObject(dpRef);

      await updateUserDoc(
        {
          dp: {
            fileName: 'dummyDp',
            url: '',
          },
        },
        id
      );

      // $##$#$#$#$#$#$ Update useDpUrl field in all his posts ##############
      await updatePostsDocFields('userId', '==', id, { userDpUrl: '' });

      await updateCommentPostFields('userId', '==', id, {
        userDpUrl: '',
      });

      // Update userDpUrl  in notifications
      const notfiRef = collection(firestoreInstance, 'notifications');

      const q = query(notfiRef, where('whoMade.userId', '==', id));
      const notifiSnap = await getDocs(q);

      notifiSnap.forEach(async (n) => {
        const { userId: nUID, userName } = n.get('whoMade');

        await updateDoc(doc(firestoreInstance, 'notifications', n.id), {
          whoMade: { userName, userDpUrl: '', userId: nUID },
        });
      });
      // Update userDpUrl in notifications ends

      await getUpdatedUserDoc(id);

      // await getUpdatedPosts(info, id);

      dispatch(notificationShowSuccess({ msg: 'Successfully removed  dp!' }));
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      dispatch(userLoadingEnds());
    }
  };

  // #@@#@#@#@#@@## All Dp Related Ends #$#$$#$#$#$#$##$#$

  // handling nav
  const history = useHistory();
  const postsLinkRef = useRef(null);
  const savedLinkRef = useRef(null);

  // Handling active nav
  useEffect(() => {
    if (!userId && !loading) {
      if (history.location.pathname.includes('saved')) {
        postsLinkRef.current.classList.remove('active');
        savedLinkRef.current.classList.add('active');
      } else if (!userId) {
        postsLinkRef.current.classList.add('active');
        savedLinkRef.current.classList.remove('active');
      }
    }
  }, [history.location.pathname, userId, loading]);

  const [myPosts, setMyPosts] = useState([]);

  // Get logged in user posts
  useEffect(() => {
    const getPosts = async () => {
      const q = query(
        collection(firestoreInstance, 'posts'),
        where('userId', '==', id)
      );

      const myPostsSnap = await getDocs(q);
      const newPosts = [];
      let index = 0;

      myPostsSnap.forEach((p) => {
        newPosts.push(p.data());

        if (index === myPostsSnap.size - 1) {
          setMyPosts(newPosts.sort((a, b) => b.createdOn - a.createdOn));
          setLoading(false);
        }

        index += 1;
      });

      if (myPostsSnap.size === 0) {
        setLoading(false);
      }
    };

    if (!userId) {
      getPosts();
    }
  }, [id, userId]);

  const [amIFollingProfilePerson, setAmIFollingProfilePerson] = useState(false);

  // Check that is logged in user following profile person
  useEffect(() => {
    if (info && !userLoading && Object.keys(profile).length !== 0) {
      if (info.following.includes(userId)) {
        setAmIFollingProfilePerson(true);
      } else {
        setAmIFollingProfilePerson(false);
      }

      if (info.following.length === 0) {
        setAmIFollingProfilePerson(false);
      }
    }
  }, [info, userLoading, profile, userId]);

  const [dialogToView, setDialogToView] = useState(null);

  const [followUnfollowLoading, setfollowUnfollowLoading] = useState(false);

  const unfollowAPerson = async (e) => {
    setfollowUnfollowLoading(true);

    setDialogToView(null);

    document.body.classList.remove('dialog_active');

    const personId = e.target.getAttribute('data-value');

    try {
      // Removing my id from person's followers array whom you  gonna unfollow
      await updateDoc(doc(firestoreInstance, 'users', personId), {
        followers: arrayRemove(id),
      });

      // Remove person's id whom you gonna unfollow, from my following array
      const userRef = doc(firestoreInstance, 'users', id);

      await updateDoc(userRef, {
        following: arrayRemove(personId),
      });

      setTimeout(async () => {
        await getUpdatedUserDoc(id);

        setfollowUnfollowLoading(false);

        dispatch(notificationShowInfo({ msg: 'Unfollowed a person!' }));
      }, 1000);
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      setLoading(false);
    }
  };

  const { sendNotification } = useNotificationOperations();

  const followAPerson = async (e) => {
    setfollowUnfollowLoading(true);

    setDialogToView(null);
    document.body.classList.remove('dialog_active');

    const personId = e.target.getAttribute('data-value');

    try {
      // Adding my id in person's followers array whom you  gonna follow
      await updateDoc(doc(firestoreInstance, 'users', personId), {
        followers: arrayUnion(id),
      });

      // Add person's id whom you gonna follow, in my following array
      const userRef = doc(firestoreInstance, 'users', id);
      await updateDoc(userRef, {
        following: arrayUnion(personId),
      });

      // Send notification
      const notification = {
        body: `has started following you`,
        sendToUserId: personId,
        whoMade: {
          userName: info.userName,
          userId: id,
          userDpUrl: info.dp.url,
        },
        postId: null,
        postImg: '',
        createdOn: Date.now(),
      };

      await sendNotification(personId, notification);

      setTimeout(async () => {
        await getUpdatedUserDoc(id);

        setfollowUnfollowLoading(false);

        dispatch(
          notificationShowInfo({ msg: 'Successfully followed a person!' })
        );
      }, 1000);
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));

      setLoading(false);
    }
  };

  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    setFollowing([]);
    setFollowers([]);

    const fetchFollowers = async (followersArr) => {
      const newFollowers = [];

      followersArr.forEach(async (persId, index) => {
        const docRef = doc(firestoreInstance, 'users', persId);
        const userSnap = await getDoc(docRef);

        if (userSnap.exists()) {
          newFollowers.push({ ...userSnap.data(), docId: userSnap.id });
        }

        if (index === followersArr.length - 1) {
          setFollowers(newFollowers);
        }
      });
    };

    const fetchPeopleWhomIFollow = async (followingPeopleArr) => {
      const newFollowing = [];

      followingPeopleArr.forEach(async (persId, index) => {
        const docRef = doc(firestoreInstance, 'users', persId);

        const userSnap = await getDoc(docRef);

        if (userSnap.exists()) {
          newFollowing.push({ ...userSnap.data(), docId: userSnap.id });
        }

        if (index === followingPeopleArr.length - 1) {
          setFollowing(newFollowing);
        }
      });
    };

    if (userId && Object.keys(profile).length !== 0) {
      fetchFollowers(profile.followers);
      fetchPeopleWhomIFollow(profile.following);
    } else if (!userId) {
      fetchFollowers(info.followers);
      fetchPeopleWhomIFollow(info.following);
    }
  }, [userId, info.followers, info.following, profile]);

  const handleFollowingFollwersDialog = (e) => {
    const view = e.currentTarget.getAttribute('data-view');
    setDialogToView(view);

    if (view === 'following' && following.length !== 0) {
      document.body.classList.add('dialog_active');
    }

    if (view === 'followers' && followers.length !== 0) {
      document.body.classList.add('dialog_active');
    }
  };

  const closeFollowDialog = () => {
    setDialogToView(null);
    document.body.classList.remove('dialog_active');
  };

  return {
    following,
    dialogToView,
    closeFollowDialog,
    followers,
    unfollowAPerson,
    followAPerson,
    myPosts,
    info,
    amIFollingProfilePerson,
    openChangeDpDialog,
    handlingChangeDp,
    cancelChangeDp,
    handleDpChange,
    userLoading,
    removeDp,
    closeDialog,
    postsLinkRef,
    savedLinkRef,
    loading,
    profile,
    userId,
    personPosts,
    handleFollowingFollwersDialog,
    id,
    followUnfollowLoading,
  };
};

export default useProfileLogic;
