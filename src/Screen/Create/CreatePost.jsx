import { useDropzone } from 'react-dropzone';
import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import PermMediaOutlinedIcon from '@material-ui/icons/PermMediaOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import { useDispatch } from 'react-redux';
import setValidationMessage from '../../utils/setValidationMessage';

import Button from '../../Components/Button';
import { notificationShowInfo } from '../../features/notification';

const CreatePost = ({ handleCloseCreatePost }) => {
  const dispatch = useDispatch();

  const setTimeOutId = useRef(0);
  const captionValidationMessageTag = useRef(null);
  const [caption, setCaption] = useState('');
  const [previews, setPreviews] = useState([]);

  const onDrop = useCallback(
    (acceptedFile) => {
      acceptedFile.forEach((item, index) => {
        if (index < 4) {
          setPreviews((prevState) => [
            ...prevState,
            { p: URL.createObjectURL(item), f: item },
          ]);
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
    // setPreview({ p: '', file: null });
    // setFiles([]);
  };

  // HANDLE THIS
  const handleViewPreview = () => {
    // const file = files.filter(
    //   (i) => i.name === e.currentTarget.getAttribute('data-name')
    // );
    // setPreview({
    //   p: e.currentTarget.getAttribute('data-blob'),
    //   file,
    // });
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
        setPreviews((prevPrev) => {
          if (prevPrev.length < 4) {
            return [...prevPrev, { p: URL.createObjectURL(item), f: item }];
          } else {
            return [...prevPrev];
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
      console.log(caption);
    }
  };

  const handleDelete = (e) => {
    const blobToDelete = e.currentTarget.getAttribute('data-blob');
    const nameOfFileToDelete = JSON.parse(
      e.currentTarget.getAttribute('data-name')
    );

    console.log(nameOfFileToDelete);

    // setFiles(
    //   files.filter((item, index, arr) => {
    //     if (item.name !== nameOfFileToDelete) {
    //       return true;
    //     } else {
    //       if (arr.length === 0) setPreview({ ...preview, file: null });

    //       setPreview({ ...preview, file: arr[index - 1] });

    //       return false;
    //     }
    //   })
    // );

    setPreviews(
      previews.filter((item) => {
        if (item !== blobToDelete) {
          return true;
        } else {
          // if (arr.length === 0) setPreview({ ...preview, p: '' });

          // setPreview({ ...preview, p: arr[index - 1] });

          return false;
        }
      })
    );
  };

  return (
    <Wrapper>
      <div className='new_post'>
        <div className='top flex'>
          <h1 className='heading'>New Post</h1>
          <CloseIcon className='ic_close' onClick={handleCloseCreatePost} />
        </div>

        {previews.length === 0 ? (
          <div className='hero flex' {...getRootProps()}>
            <PermMediaOutlinedIcon className='ic_images' />

            <input
              {...getInputProps({
                accept: '.jpg, .jpeg, .png',
              })}
            />

            {isDragActive ? (
              <p>Drop the photo here ...</p>
            ) : (
              <h1 className='drag_msg'>
                Drag your photo, or click to select file here
              </h1>
            )}
          </div>
        ) : (
          <div className='image_preview_and_upload flex'>
            <PreviewImages className='flex'>
              <div className='big_preview'>
                <DeleteForeverOutlinedIcon
                  className='delete_btn'
                  onClick={handleDelete}
                  data-blob={previews[0].p}
                  data-name={JSON.stringify(previews[0].f.name)}
                />

                <img src={previews[0].p} alt='big_preview' />
              </div>

              <div className='small_previews flex'>
                {previews.length !== 0 &&
                  previews.map(({ p, f }) => (
                    <div
                      className='preview'
                      key={p}
                      data-blob={p}
                      onClick={handleViewPreview}
                      data-name={JSON.stringify(f)}
                    >
                      <img src={p} alt='blob' />
                    </div>
                  ))}

                {previews.length < 4 && (
                  <label htmlFor='image'>
                    <AddBoxOutlinedIcon className='add_more' />
                  </label>
                )}

                <input
                  type='file'
                  accept='.jpg, .jpeg, .png'
                  id='image'
                  style={{ display: 'none' }}
                  multiple
                  onChange={handleAddMore}
                />
              </div>

              <Button
                handleClick={cancelUpload}
                padding='8px 16px'
                margin='40px 0 0 0'
                borderRadius='5px'
                width='40%'
                transform='scale(1.04)'
              >
                Cancel
              </Button>
            </PreviewImages>

            <CaptionAndUpload className='flex'>
              <div className='caption_top'>
                <div className='user_name_dp flex'>
                  <div className='dp'>
                    <img src='https://i.pravatar.cc/300' alt='dp' />
                  </div>

                  <div className='username'>ddepu11</div>
                </div>

                <div className='caption_div'>
                  <textarea
                    rows='11'
                    onChange={handleCaption}
                    value={caption}
                  />
                </div>

                <p className='message' ref={captionValidationMessageTag} />
              </div>

              <Button
                padding='8px 16px'
                borderRadius='5px'
                bgColor='#0095f6'
                color='#ffffff'
                width='100%'
                bSh=''
                transform='scale(1.03)'
                handleClick={handleUpload}
              >
                Upload
              </Button>
            </CaptionAndUpload>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: grid;
  place-content: center;
  z-index: 9;

  .heading {
    font-size: 1.1em;
    letter-spacing: 1px;
  }

  .new_post {
    width: 89vw;
    height: 89vh;
    background-color: #fbfbfb;
    border-radius: 15px;
  }

  .top {
    padding: 12px 0;
    color: #343;
    position: relative;
    border-bottom: 1px solid #d8d8d8;
  }

  .ic_close {
    position: absolute;
    top: 8px;
    right: 15px;
    font-size: 1.8em;
  }

  .ic_close:hover {
    cursor: pointer;
  }

  .hero {
    height: 82.5vh;
    flex-direction: column;

    .ic_images {
      font-size: 5em;
      color: #777777;
    }

    .drag_msg {
      color: #777777;
      font-weight: 200;
      font-size: 1.5em;
      margin-top: 10px;
    }

    .drag_msg:hover {
      cursor: default;
    }
  }
`;

const PreviewImages = styled.div`
  height: 82.5vh;
  width: 70%;
  flex-direction: column;

  .big_preview {
    position: relative;
    width: 600px;
    height: 350px;
    /* border: 1px solid red; */

    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
      object-fit: contain;
    }

    .delete_btn {
      position: absolute;
      right: 0;
      color: var(--danger-color);
      font-size: 1.8em;
      transition: transform 0.5s ease;
    }

    .delete_btn:hover {
      cursor: pointer;
      transform: scale(1.05);
    }
  }

  .small_previews {
    margin-top: 30px;
    width: 60%;
    justify-content: flex-start;
    /* border: 1px solid #333; */

    .preview {
      width: 100px;
      height: 100px;
      margin-right: 12px;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .preview:hover {
      cursor: pointer;
    }

    .add_more {
      width: 40px;
      height: 40px;
      color: #333;
      transition: transform 0.5s ease;
      margin-left: 10px;
    }

    .add_more:hover {
      cursor: pointer;
      transform: scale(1.2);
    }
  }
`;

const CaptionAndUpload = styled.aside`
  padding: 15px 10px;
  border-left: 1px solid #d8d8d8;
  width: 30%;
  height: 82.5vh;
  flex-direction: column;
  justify-content: space-between !important;
  align-items: flex-start !important;

  .caption_top {
    width: 100%;
  }

  .user_name_dp {
    justify-content: flex-start;

    .dp {
      width: 34px;
      height: 34px;
      /* border: 1px solid red; */

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: contain;
      }
    }

    .username {
      margin-left: 12px;
      font-weight: 700;
      color: #333;
    }
  }

  .caption_div {
    /* border: 1px solid red; */
    margin-top: 20px;
    width: 100%;

    textarea {
      width: 100%;
      border: 1px solid #e0dede;
      padding: 8px 10px;
      color: #333;
      font-size: 1.1em;
    }
  }
`;

CreatePost.propTypes = {
  handleCloseCreatePost: PropTypes.func.isRequired,
};

export default CreatePost;
