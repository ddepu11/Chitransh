import { collection, where, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { firestoreInstance } from '../../../../config/firebase';

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

  return { users, loading };
};

export default useFeedLogic;
