import {
  collection,
  where,
  onSnapshot,
  query,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import useNotificationOperations from '../../../../Components/useNotificationOperations';
import useUserOperation from '../../../../Components/useUserOperations';
import { firestoreInstance } from '../../../../config/firebase';
import {
  notificationShowError,
  notificationShowInfo,
} from '../../../../features/notification';

const useFeedLogic = (info, id) => {
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    setLoading(true);

    const q = query(
      collection(firestoreInstance, 'users'),
      where('__name__', 'not-in', [...info.following, id])
    );

    const unsub = onSnapshot(q, (usersSnap) => {
      let index = 0;
      const newUsers = [];

      usersSnap.forEach((u) => {
        newUsers.push({ ...u.data(), userDocId: u.id });

        // At the end of usersSnap store new Users in users state
        if (index === usersSnap.size - 1) {
          if (mounted.current) {
            setUsers(newUsers.sort((a, b) => b.createdOn - a.createdOn));
            setLoading(false);
          }
        }

        index += 1;
      });
    });

    return () => {
      mounted.current = false;
      unsub();
    };
  }, [dispatch, id, info.following]);

  const { getUpdatedUserDoc } = useUserOperation();
  const { sendNotification } = useNotificationOperations();

  const [followLoading, setFollowLoading] = useState(false);

  const followAPerson = async (e) => {
    setFollowLoading(true);

    const personDocId = e.target.getAttribute('data-value');

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

      await getUpdatedUserDoc(id);

      setFollowLoading(false);

      dispatch(
        notificationShowInfo({ msg: 'Successfully followed a person!' })
      );
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));

      setFollowLoading(true);
    }
  };

  return { users, loading, followAPerson, followLoading };
};

export default useFeedLogic;
