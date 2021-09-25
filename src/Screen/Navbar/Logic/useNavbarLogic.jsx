import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { authInstance } from '../../../config/firebase';
import {
  notificationShowError,
  notificationShowInfo,
} from '../../../features/notification';
import { userLoadingEnds } from '../../../features/user';

const useNavbarLogic = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [activeIcon, setActiveIcon] = useState('home');
  const dropDownFromAvatar = useRef(null);

  const { info } = useSelector((state) => state.user.value);

  useEffect(() => {
    setActiveIcon('home');
  }, []);

  useEffect(() => {
    const handleOnDocumentClick = (e) => {
      e.target.matches('.profile');

      if (
        e.target.closest('.the_box') === null &&
        !e.target.matches('.ava_img') &&
        dropDownFromAvatar.current !== null
      ) {
        dropDownFromAvatar.current.classList.remove('active');

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

  const handleActiveIcon = (e) => {
    const icon = e.currentTarget.getAttribute('data-icon');
    setActiveIcon(icon);
    // Show Drop Down
    dropDownFromAvatar.current.classList.add('active');
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
  };

  const handleCloseAvatarDrop = () => {
    dropDownFromAvatar.current.classList.remove('active');
  };

  return {
    handleCloseCreatePost,
    handleLogOut,
    handleActiveIcon,
    activeIcon,
    dropDownFromAvatar,
    info,
    handleCloseAvatarDrop,
    setActiveIcon,
  };
};

export default useNavbarLogic;
