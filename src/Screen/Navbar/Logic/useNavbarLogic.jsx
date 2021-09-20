import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authInstance } from '../../../config/firebase';
import {
  notificationShowError,
  notificationShowInfo,
} from '../../../features/notification';
import { userLoadingEnds } from '../../../features/user';

const useNavbarLogic = () => {
  const dispatch = useDispatch();
  const [activeIcon, setActiveIcon] = useState('home');
  const dropDownFromAvatar = useRef(null);

  const handleOnDocumentClick = (e) => {
    e.target.matches('.profile');

    if (
      e.target.closest('.the_box') === null &&
      !e.target.matches('.ava_img') &&
      dropDownFromAvatar.current !== null
    ) {
      dropDownFromAvatar.current.classList.remove('active');
    }
  };

  document.addEventListener('click', handleOnDocumentClick);

  const handleActiveIcon = (e) => {
    const icon = e.currentTarget.getAttribute('data-icon');
    setActiveIcon(icon);
    dropDownFromAvatar.current.classList.add('active');
  };

  const handleLogOut = () => {
    authInstance
      .signOut()
      .then(() => {
        dispatch(notificationShowInfo({ msg: 'Successfully logged out' }));
      })
      .catch((err) => {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        dispatch(userLoadingEnds());
      });
  };

  const handleCloseCreatePost = () => setActiveIcon('home');

  useEffect(() => {
    console.log('');
    return () => {
      document.removeEventListener('click', handleOnDocumentClick);
    };
  }, []);

  return {
    handleCloseCreatePost,
    handleLogOut,
    handleActiveIcon,
    activeIcon,
    dropDownFromAvatar,
  };
};

export default useNavbarLogic;
