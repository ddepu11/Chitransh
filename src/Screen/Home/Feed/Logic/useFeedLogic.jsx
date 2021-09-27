import { collection, orderBy, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { firestoreInstance } from '../../../../config/firebase';
import { notificationShowError } from '../../../../features/notification';

const useFeedLogic = () => {
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { info, id, userLoading, hasUserLoggedIn } = useSelector(
    (state) => state.user.value
  );

  useEffect(() => {
    const fetchSuggestFollowers = async () => {
      try {
        const postsCollection = collection(firestoreInstance, 'users');

        const q = query(postsCollection, orderBy('createdOn', 'desc'));

        const usersSnap = await getDocs(q);

        let index = 0;
        const newUsers = [];

        usersSnap.forEach((u) => {
          // console.log(info.following);

          info.following.forEach((folId) => {
            // console.log(&& u.id !== id);
            if (folId !== u.get('id') && u.id !== id) {
              newUsers.push(u.data());
            }
          });

          if (index === usersSnap.size - 1) {
            setUsers(newUsers);
            console.log(newUsers);
          }
          index += 1;
        });
      } catch (err) {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        setLoading(false);
      }
    };

    if (!userLoading && hasUserLoggedIn) {
      fetchSuggestFollowers();
    }
  }, [dispatch, info, id, userLoading, hasUserLoggedIn]);

  return { users, loading };
};

export default useFeedLogic;
