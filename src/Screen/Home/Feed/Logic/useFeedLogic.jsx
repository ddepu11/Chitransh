import {
  collection,
  orderBy,
  getDocs,
  query,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import useNotificationOperations from '../../../../Components/useNotificationOperations';
import usePostsOperation from '../../../../Components/usePostsOperation';
import useUserOperation from '../../../../Components/useUserOperations';
import { firestoreInstance } from '../../../../config/firebase';
import {
  notificationShowError,
  notificationShowInfo,
} from '../../../../features/notification';
import { clearPosts } from '../../../../features/posts';

const useFeedLogic = (info, id) => {
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const fetchSuggestFollowers = async () => {
      try {
        const usersCollection = collection(firestoreInstance, 'users');

        const q = query(usersCollection, orderBy('createdOn', 'desc'));

        const usersSnap = await getDocs(q);

        let index = 0;
        const newUsers = [];

        usersSnap.forEach((u) => {
          if (
            info.following.length !== 0 &&
            !info.following.includes(u.id) &&
            u.id !== id
          ) {
            newUsers.push({ ...u.data(), userDocId: u.id });
          }

          // Runs when you have no followers
          if (info.following.length === 0) {
            if (u.id !== id) {
              newUsers.push({ ...u.data(), userDocId: u.id });
            }
          }

          // At the end of usersSnap store new Users in users state
          if (index === usersSnap.size - 1) {
            console.log(newUsers);
            if (mounted.current) {
              setUsers(newUsers);
              setLoading(false);
            }
          }

          index += 1;
        });
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        if (mounted.current) setLoading(false);
      }
    };

    if (mounted.current) setLoading(true);
    fetchSuggestFollowers();

    return () => {
      console.log('Feed Clean up');
      mounted.current = false;
    };
  }, [dispatch, id, info.following]);

  const { getUpdatedUserDoc } = useUserOperation();
  const { sendNotification } = useNotificationOperations();
  const { getUpdatedPosts } = usePostsOperation();

  const followAPerson = async (e) => {
    const personDocId = e.target.getAttribute('data-value');

    setLoading(true);

    try {
      // Adding my id in person's followers array whom you  gonna follow
      await updateDoc(doc(firestoreInstance, 'users', personDocId), {
        followers: arrayUnion(id),
      });

      // Add person's id whom you gonna follow, in logged in user's following array
      const userRef = doc(firestoreInstance, 'users', id);
      await updateDoc(userRef, {
        following: arrayUnion(personDocId),
      });

      // setUsers((prevState) => [
      //   ...prevState.filter((item) => item.userDocId !== personDocId),
      // ]);

      // Send notification
      const notification = {
        body: `has started following you`,
        sendToUserId: personDocId,
        whoMade: {
          userName: info.userName,
          userId: id,
          userDpUrl: info.dp.url,
        },
        postId: null,
        postImg: '',
        createdOn: Date.now(),
      };

      await sendNotification(personDocId, notification);

      setTimeout(async () => {
        dispatch(clearPosts());

        await getUpdatedUserDoc(id);

        await getUpdatedPosts(info, id);

        setLoading(false);

        dispatch(
          notificationShowInfo({ msg: 'Successfully followed a person!' })
        );
      }, 2000);
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));

      setLoading(false);
    }
  };

  return { users, loading, followAPerson };
};

export default useFeedLogic;
