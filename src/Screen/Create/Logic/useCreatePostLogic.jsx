import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  addDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestoreInstance, storage } from '../../../config/firebase';
import usePostsOperation from '../../../Components/usePostsOperation';

import {
  notificationShowError,
  notificationShowInfo,
  notificationShowSuccess,
} from '../../../features/notification';
import { userLoadingBegins, userLoadingEnds } from '../../../features/user';
import setValidationMessage from '../../../utils/setValidationMessage';

const useCreatePostLogic = (handleCloseCreatePost) => {
  const dispatch = useDispatch();

  const { id, info, userLoading } = useSelector((state) => state.user.value);

  const setTimeOutId = useRef(0);
  const captionValidationMessageTag = useRef(null);

  const [caption, setCaption] = useState('');
  const [previews, setPreviews] = useState([]);
  const [preview, setPreview] = useState({ p: '', f: null });

  const onDrop = useCallback(
    (acceptedFile) => {
      acceptedFile.forEach((item, index) => {
        const tempBlob = URL.createObjectURL(item);

        if (index === 0) {
          setPreview({ p: tempBlob, f: item });
        }

        if (index < 4) {
          setPreviews((prevState) => [...prevState, { p: tempBlob, f: item }]);
        }
      });

      if (acceptedFile.length > 4) {
        dispatch(notificationShowInfo({ msg: 'Only 4 images allowed' }));
      }
    },
    [dispatch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const cancelUpload = () => {
    setPreviews([]);
    setPreview({ p: '', f: null });
  };

  const handleViewPreview = (e) => {
    const name = e.currentTarget.getAttribute('data-name');

    const file = previews.filter(({ f }) => f.name === name)[0];

    setPreview(file);
  };

  const handleAddMore = (e) => {
    const { files: moreImages } = e.target;

    Array.from(moreImages).forEach((item) => {
      let doesImageExists = false;

      previews.forEach(({ f }) => {
        if (f.name === item.name) {
          doesImageExists = true;
          dispatch(
            notificationShowInfo({ msg: 'You already added that image!' })
          );
        }
      });

      if (!doesImageExists) {
        setPreviews((prevState) => {
          if (prevState.length < 4) {
            return [...prevState, { p: URL.createObjectURL(item), f: item }];
          } else {
            return prevState;
          }
        });
      }
    });
  };

  const handleCaption = (e) => {
    setCaption(e.target.value);
  };

  const { getUpdatedPosts } = usePostsOperation();

  const createPost = async () => {
    try {
      const docRef = await addDoc(collection(firestoreInstance, 'posts'), {
        id: uuidv4(),
        userId: id,
        userName: info.userName,
        userDpUrl: info.dp.url,
        caption,
        images: [],
        createdOn: Date.now(),
        comments: [],
        likes: 0,
      });

      if (docRef) {
        previews.forEach(async ({ f }, index) => {
          const randomName = `${info.userName}_${Math.floor(
            Math.random() * Date.now()
          )}`;

          const imageRef = ref(storage, `posts_images/${id}/${randomName}`);
          await uploadBytes(imageRef, f);

          const url = await getDownloadURL(imageRef);

          await updateDoc(doc(firestoreInstance, 'posts', docRef.id), {
            images: arrayUnion({
              fileName: randomName,
              url,
            }),
          });

          if (index === previews.length - 1) {
            dispatch(userLoadingEnds());

            handleCloseCreatePost();

            getUpdatedPosts(info, id);
            dispatch(
              notificationShowSuccess({
                msg: 'Successfully created your post!',
              })
            );
          }
        });
      }
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
      dispatch(userLoadingEnds());
      handleCloseCreatePost();
    }
  };

  const handleUpload = () => {
    let errorFlag = false;

    if (caption.length > 50) {
      setValidationMessage(
        'Caption is too lengthy!',
        'error',
        setTimeOutId,
        captionValidationMessageTag
      );
      errorFlag = true;
    }

    if (caption.length < 2) {
      setValidationMessage(
        'Caption is too short!',
        'error',
        setTimeOutId,
        captionValidationMessageTag
      );
      errorFlag = true;
    }

    if (caption === '') {
      setValidationMessage(
        'Caption cant be empty',
        'error',
        setTimeOutId,
        captionValidationMessageTag
      );
      errorFlag = true;
    }

    if (!errorFlag) {
      createPost();
      dispatch(userLoadingBegins());
    }
  };

  const handleRemoveImage = (e) => {
    const blobToDelete = e.currentTarget.getAttribute('data-blob');

    setPreviews(
      previews.filter(({ p }, index, arr) => {
        if (p !== blobToDelete) {
          return true;
        } else {
          if (index === 0 && arr[index + 1]) {
            setPreview({ p: arr[index + 1].p, f: arr[index + 1].f });
          } else if (!arr[index - 1] && !arr[index + 1]) {
            setPreview({ p: '', file: null });
            setPreviews([]);
          } else {
            setPreview({ p: arr[index - 1].p, f: arr[index - 1].f });
          }

          return false;
        }
      })
    );
  };

  return {
    handleRemoveImage,
    handleUpload,
    handleCaption,
    handleAddMore,
    handleViewPreview,
    cancelUpload,
    getRootProps,
    getInputProps,
    isDragActive,
    preview,
    previews,
    caption,
    userLoading,
    captionValidationMessageTag,
  };
};

export default useCreatePostLogic;
