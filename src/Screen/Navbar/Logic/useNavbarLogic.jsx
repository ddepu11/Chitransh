import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getDocs, query, where, collection } from 'firebase/firestore';
import usePostsOperation from '../../../Components/usePostsOperation';
import { authInstance, firestoreInstance } from '../../../config/firebase';

import {
  notificationShowError,
  notificationShowInfo,
} from '../../../features/notification';
import { userLoadingEnds } from '../../../features/user';

const useNavbarLogic = () => {
  const dispatch = useDispatch();

  const history = useHistory();
  const [activeIcon, setActiveIcon] = useState('home');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropDownFromAvatar = useRef(null);
  const notificationDropDown = useRef(null);

  const { info, id } = useSelector((state) => state.user.value);

  useEffect(() => {
    setActiveIcon('home');
  }, []);

  useEffect(() => {
    const handleOnDocumentClick = (e) => {
      // For hiding Avatar dropdown
      if (
        e.target.closest('.the_avatar_box') === null &&
        !e.target.matches('.ava_img') &&
        dropDownFromAvatar.current !== null
      ) {
        dropDownFromAvatar.current.classList.remove('active');

        // If click any where then add, liked icon and add icon is not active
        // set active as home
        if (
          !e.target.matches('.ic_add') &&
          !e.target.matches('.ic_liked') &&
          history.location.pathname === '/' &&
          activeIcon !== 'add'
        )
          setActiveIcon('home');
      }

      // For hiding  Notification dropdown
      if (
        !e.target.matches('.ic_liked') &&
        !e.target.matches('.ava_img') &&
        notificationDropDown.current !== null
      ) {
        notificationDropDown.current.classList.remove('active');

        // If click any where then add, liked icon and add icon is not active
        // set active as home

        if (
          !e.target.matches('.ic_add') &&
          !e.target.matches('.ic_liked') &&
          history.location.pathname === '/' &&
          activeIcon !== 'add'
        )
          setActiveIcon('home');
      }
    };

    document.addEventListener('click', handleOnDocumentClick);

    return () => {
      document.removeEventListener('click', handleOnDocumentClick);
    };
  }, [history, activeIcon]);

  // Get Notifications
  const getNotifications = async () => {
    const q = query(
      collection(firestoreInstance, 'notifications'),
      where('sendToUserId', '==', id)
    );

    const myNotificationsSnap = await getDocs(q);

    const newNotifications = [];
    let index = 0;

    myNotificationsSnap.forEach((doc) => {
      newNotifications.push(doc.data());

      if (index === myNotificationsSnap.size - 1) {
        setNotifications(newNotifications);
        setLoading(false);
      }

      index += 1;
    });

    if (myNotificationsSnap.size === 0) {
      setLoading(false);
    }
  };

  const handleActiveIcon = (e) => {
    const icon = e.currentTarget.getAttribute('data-icon');
    setActiveIcon(icon);

    if (icon === 'add') {
      document.body.classList.add('dialog_active');
    }

    // Notification dropdown
    if (icon === 'like') {
      notificationDropDown.current.classList.add('active');
      setLoading(true);
      getNotifications();
    }

    // Avatar dropdown
    if (icon === 'avatar') {
      // Show Drop Down
      dropDownFromAvatar.current.classList.add('active');
    }
  };

  const handleLogOut = () => {
    authInstance
      .signOut()
      .then(() => {
        history.push('/login');

        dispatch(notificationShowInfo({ msg: 'Successfully logged out' }));
      })
      .catch((err) => {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        dispatch(userLoadingEnds());
      });
  };

  const handleCloseCreatePost = () => {
    setActiveIcon('home');
    document.body.classList.remove('dialog_active');
  };

  const handleCloseAvatarDrop = () => {
    dropDownFromAvatar.current.classList.remove('active');
  };

  const { getUpdatedPosts } = usePostsOperation();

  const handleClickOnLogo = async () => {
    setActiveIcon('home');

    getUpdatedPosts(info, id);
  };

  return {
    handleCloseCreatePost,
    handleLogOut,
    handleActiveIcon,
    activeIcon,
    dropDownFromAvatar,
    info,
    handleCloseAvatarDrop,
    notificationDropDown,
    loading,
    notifications,
    handleClickOnLogo,
  };
};

export default useNavbarLogic;
