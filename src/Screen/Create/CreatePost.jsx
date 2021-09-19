import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';

const CreatePost = () => {
  console.log('CreatePost');

  return (
    <Wrapper>
      <div className='new_post'>
        <div className='top flex'>
          <h1 className='heading'>New Post</h1>
          <CloseIcon className='ic_close' />
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  place-content: center;
  z-index: 9;

  .new_post {
    width: 80vw;
    height: 60vw;
    background-color: #fbfbfb;
    border-radius: 20px;
  }

  .top {
    padding: 10px 0;
    color: #343;
    position: relative;
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

  .heading {
    font-size: 1.3em;
    letter-spacing: 1px;
  }
`;

export default CreatePost;
