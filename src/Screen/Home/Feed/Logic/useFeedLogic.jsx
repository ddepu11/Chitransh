import {
  collection,
  orderBy,
  getDocs,
  query,
  doc,
  updateDoc,
  arrayUnion,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useNotificationOperations from '../../../../Components/useNotificationOperations';
import usePostsOperation from '../../../../Components/usePostsOperation';
import useUserOperation from '../../../../Components/useUserOperations';
import { firestoreInstance } from '../../../../config/firebase';
import {
  notificationShowError,
  notificationShowInfo,
} from '../../../../features/notification';

const useFeedLogic = () => {
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDocId, setUserDocId] = useState('');

  const { info, id, userLoading, hasUserLoggedIn } = useSelector(
    (state) => state.user.value
  );

  useEffect(() => {
    const fetchSuggestFollowers = async () => {
      try {
        const usersCollection = collection(firestoreInstance, 'users');

        const q = query(usersCollection, orderBy('createdOn', 'desc'));

        const usersSnap = await getDocs(q);

        let index = 0;
        const newUsers = [];

        usersSnap.forEach((u) => {
          info.following.forEach((folId) => {
            // console.log(u.id !== id);
            // get('id')
            if (folId !== u.id && u.id !== id) {
              newUsers.push(u.data());
            }
          });

          // Runs when you have no followers
          if (info.following.length === 0) {
            if (u.id !== id) {
              newUsers.push(u.data());
            }
          }

          // At the end of usersSnap store new Users in users state
          if (index === usersSnap.size - 1) {
            setUsers(newUsers);
            // console.log(newUsers);
            setLoading(false);
          }

          index += 1;
        });
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        setLoading(false);
      }
    };

    if (!userLoading && hasUserLoggedIn) {
      setLoading(true);
      fetchSuggestFollowers();
    }
  }, [dispatch, info, id, userLoading, hasUserLoggedIn]);

  const { getUpdatedUserDoc } = useUserOperation();
  const { sendNotification } = useNotificationOperations();
  const { getUpdatedPosts } = usePostsOperation();

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

        setLoading(false);

        await getUpdatedPosts(info, id);
      }, 1000);

      dispatch(
        notificationShowInfo({ msg: 'Successfully followed a person!' })
      );
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));

      setLoading(false);
    }
  };

  const getUserDocId = async (idInsideDoc) => {
    const q = query(
      collection(firestoreInstance, 'users'),
      where('id', '==', idInsideDoc)
    );
    const myPostsSnap = await getDocs(q);

    myPostsSnap.forEach((p) => {
      setUserDocId(p.id);
    });
  };

  return { users, loading, followAPerson, getUserDocId, userDocId };
};

export default useFeedLogic;
