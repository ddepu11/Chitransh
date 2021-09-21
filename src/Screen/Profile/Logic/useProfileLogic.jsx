import { useSelector } from 'react-redux';

const useProfileLogic = () => {
  const { info } = useSelector((state) => state.user.value);

  return { info };
};

export default useProfileLogic;
