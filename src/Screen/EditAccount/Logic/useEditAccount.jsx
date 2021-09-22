import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const useEditAccount = () => {
  const { info } = useSelector((state) => state.user.value);

  const [userInfo, setUserInfo] = useState({
    phoneNumber: info.phoneNumber,
    userName: info.userName,
    website: info.website,
    fullName: info.fullName,
    gender: info.gender,
    bio: info.bio,
    email: info.email,
  });

  const validationMessageTags = {
    fullNameVMTag: useRef(null),
    userNameVMTag: useRef(null),
    websiteVMTag: useRef(null),
    genderVMTag: useRef(null),
    bioVMTag: useRef(null),
    emailVMTag: useRef(null),
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    // console.log({ name, value });

    setUserInfo({ ...userInfo, [name]: value });
  };

  return { userInfo, handleInput, validationMessageTags };
};

export default useEditAccount;
