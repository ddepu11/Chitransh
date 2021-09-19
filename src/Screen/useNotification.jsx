import { useDispatch } from 'react-redux';
import { Flip, toast } from 'react-toastify';
import { notificationClear } from '../features/notification';

const useNotification = () => {
  const dispatch = useDispatch();

  const successNotification = (msg) => {
    toast.success(msg, {
      position: 'top-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      transition: Flip,
      onClose: () => dispatch(notificationClear()),
    });
  };

  const errorNotification = (msg) => {
    toast.error(msg, {
      position: 'top-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      transition: Flip,
      onClose: () => dispatch(notificationClear()),
    });
  };

  const infoNotification = (msg) => {
    toast.info(msg, {
      position: 'top-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      transition: Flip,
      onClose: () => dispatch(notificationClear()),
    });
  };

  return { successNotification, errorNotification, infoNotification };
};

export default useNotification;
