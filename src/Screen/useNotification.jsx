import { Flip, toast } from 'react-toastify';

const useNotification = () => {
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
    });
  };

  return { successNotification, errorNotification };
};

export default useNotification;
