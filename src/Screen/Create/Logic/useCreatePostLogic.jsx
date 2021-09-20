import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { notificationShowInfo } from '../../../features/notification';
import setValidationMessage from '../../../utils/setValidationMessage';

const useCreatePostLogic = () => {
  const dispatch = useDispatch();

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

  // HANDLE THIS
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
      console.log(previews);
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
    captionValidationMessageTag,
  };
};

export default useCreatePostLogic;
