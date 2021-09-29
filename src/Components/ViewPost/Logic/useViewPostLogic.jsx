import { useDispatch } from 'react-redux';
import { closePost } from '../../../features/post';

const useViewPostLogic = () => {
  const dispatch = useDispatch();

  const closeViewPost = () => {
    dispatch(closePost());
    document.body.classList.remove('dialog_active');
  };

  return { closeViewPost };
};

export default useViewPostLogic;
