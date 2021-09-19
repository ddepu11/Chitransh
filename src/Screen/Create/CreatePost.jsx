import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import PermMediaOutlinedIcon from '@material-ui/icons/PermMediaOutlined';
import Button from '../../Components/Button';

const CreatePost = () => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [preview, setPreview] = useState('');

  const onDrop = useCallback((acceptedFile) => {
    // Do something with the
    setFiles(acceptedFile);

    acceptedFile.forEach((item, index) => {
      if (index === 0) {
        setPreview(URL.createObjectURL(item));
      }

      setPreviews((prevState) => [...prevState, URL.createObjectURL(item)]);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const cancelUpload = () => {
    setPreviews([]);
    setPreview('');
    setFiles([]);
  };

  const handleViewPreview = (e) => {
    setPreview(e.currentTarget.getAttribute('data-blob'));
  };

  return (
    <Wrapper>
      <div className='new_post'>
        <div className='top flex'>
          <h1 className='heading'>New Post</h1>
          <CloseIcon className='ic_close' />
        </div>

        {!preview ? (
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
            <PreviewImages preview={preview} className='flex'>
              <div className='big_preview'>
                <img src={preview} alt='big_preview' />
              </div>

              <div className='small_previews flex'>
                {previews.length !== 0 &&
                  previews.map((item) => (
                    <div
                      className='preview'
                      key={item}
                      data-blob={item}
                      onClick={handleViewPreview}
                    >
                      <img src={item} alt='blob' />
                    </div>
                  ))}
              </div>

              <Button handleClick={cancelUpload}>Cancel</Button>
            </PreviewImages>

            <div className='caption_and_upload'>{/*  */}</div>
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

  .image_preview_and_upload {
  }

  .caption_and_upload {
    border: 1px solid red;
    width: 30%;
    height: 82.5vh;
  }
`;

const PreviewImages = styled.div`
  height: 82.5vh;
  width: 70%;
  flex-direction: column;

  .big_preview {
    width: 500px;
    height: 270px;
    /* border: 1px solid red; */

    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
      object-fit: contain;
    }
  }

  .small_previews {
    margin-top: 40px;
    width: 60%;
    justify-content: flex-start;
    /* border: 1px solid #333; */

    .preview {
      width: 70px;
      height: 70px;
      margin-right: 12px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
    }
    .preview:hover {
      cursor: pointer;
    }
  }
`;

export default CreatePost;
