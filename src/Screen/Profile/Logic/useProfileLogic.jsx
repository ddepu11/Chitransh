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
  const [loading, setLoading] = useState(true);
  const [personPosts, setPersonPosts] = useState([]);

  const { userId } = useParams();

  const { info, id, userLoading } = useSelector((state) => state.user.value);

  // Runs When viewing someone profile
  useEffect(() => {
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
          setPersonPosts(newPosts);
          setLoading(false);
        }

        index += 1;
      });
    };

    const fetchProfile = async () => {
      const docRef = doc(firestoreInstance, 'users', userId);
      const userSnap = await getDoc(docRef);

      if (userSnap.exists()) {
        setProfile(userSnap.data());
        getPosts();
      }
    };

    if (userId && Object.keys(profile).length === 0) {
      fetchProfile();
    } else {
      setLoading(false);
    }

    return () => {
      setLoading(false);
    };
  }, [userId, profile]);

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

  const { getUpdatedPosts, updatePostsDocFields } = usePostsOperation();
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

      await getUpdatedPosts(info, id);

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

      await getUpdatedPosts(info, id);

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

      await getUpdatedPosts(info, id);

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
          setMyPosts(newPosts);
        }

        index += 1;
      });
    };

    if (!userId) getPosts();
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

  const unfollowAPerson = async (e) => {
    const personId = e.target.getAttribute('data-value');

    setLoading(true);

    try {
      // Removing my id from person's followers array whom you  gonna unfollow
      const usersCollectionRef = collection(firestoreInstance, 'users');

      const q = query(usersCollectionRef, where('id', '==', personId));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (u) => {
        await updateDoc(doc(firestoreInstance, 'users', u.id), {
          followers: arrayRemove(id),
        });

        // Remove person's id whom you gonna unfollow, from my following array
        const userRef = doc(firestoreInstance, 'users', id);
        await updateDoc(userRef, {
          following: arrayRemove(u.id),
        });
      });

      setTimeout(async () => {
        await getUpdatedUserDoc(id);

        await getUpdatedPosts(info, id);

        setLoading(false);

        dispatch(notificationShowInfo({ msg: 'Unfollowed a person!' }));
      }, 1000);
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      setLoading(false);
    }
  };

  const { sendNotification } = useNotificationOperations();

  const followAPerson = async (e) => {
    const personId = e.target.getAttribute('data-value');

    setLoading(true);

    try {
      // Adding my id in person's followers array whom you  gonna follow
      const usersCollectionRef = collection(firestoreInstance, 'users');

      const q = query(usersCollectionRef, where('id', '==', personId));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (u) => {
        await updateDoc(doc(firestoreInstance, 'users', u.id), {
          followers: arrayUnion(id),
        });

        // Add person's id whom you gonna follow, in my following array
        const userRef = doc(firestoreInstance, 'users', id);
        await updateDoc(userRef, {
          following: arrayUnion(u.id),
        });

        // Send notification
        const notification = {
          body: `has started following you`,
          sendToUserId: u.id,
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
      });

      setTimeout(async () => {
        await getUpdatedUserDoc(id);

        await getUpdatedPosts(info, id);

        setLoading(false);

        dispatch(
          notificationShowInfo({ msg: 'Successfully followed a person!' })
        );
      }, 1000);
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));

      setLoading(false);
    }
  };

  return {
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
  };
};

export default useProfileLogic;
