import styled from 'styled-components';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import PropsType from 'prop-types';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import Button from '../Button';
import { useState } from 'react';

const Post = ({ post }) => {
  const { caption, comments, createdOn, images, likes, userDpUrl, userName } =
    post;

  const currentTimeInMs = new Date().getTime() - createdOn;

  // 1s  = 1000ms
  // 1m  = 60 * 1000
  // 1hr = 60 * 60 * 1000
  // 1day =  24 *60 * 60 *1000

  const msInAMinute = 60 * 1000;
  const msInAHour = 60 * 60 * 1000;
  const msInADay = 24 * 60 * 60 * 1000;

  const hours = Math.floor((currentTimeInMs % msInADay) / msInAHour);
  const minutes = Math.floor((currentTimeInMs % msInAHour) / msInAMinute);
  const seconds = Math.floor((currentTimeInMs % msInAMinute) / 1000);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const showPreviousImage = () => {
    if (currentImageIndex === 0) {
      setCurrentImageIndex(images.length - 1);
    } else {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevState) => {
      if (prevState === images.length - 1) {
        return 0;
      } else {
        return prevState + 1;
      }
    });
  };

  return (
    <Wrapper>
      <div className='post_top flex'>
        <div className='left flex'>
          <div className='dp'>
            <img src={userDpUrl} alt='' />
          </div>

          <h3 className='username'>{userName}</h3>
        </div>

        <MoreHorizIcon className='more_btn' />
      </div>

      <div className='hero'>
        {images.length > 1 && (
          <>
            <NavigateBeforeIcon
              className='previous'
              onClick={showPreviousImage}
            />

            <NavigateNextIcon className='next' onClick={showNextImage} />
          </>
        )}
        <img src={images[currentImageIndex].url} alt='s' />
      </div>

      <div className='btns flex'>
        <div className='btn_left flex'>
          <FavoriteBorderOutlinedIcon className='ic_like' />
          {/* <FavoriteOutlinedIcon className='ic_dislike' /> */}

          <ModeCommentOutlinedIcon className='ic_comment' />
        </div>

        <div className='which_no_of_image'>a</div>

        <div className='btn_save'>
          <BookmarkBorderOutlinedIcon className='ic_save' />
          {/* <BookmarkIcon className='ic_saved' /> */}
        </div>
      </div>
      <div className='likes'>{likes} likes</div>

      <div className='username_and_caption'>
        <p className='caption'>
          <span className='username'>{userName}</span>
          {caption}
        </p>
      </div>

      {comments.length !== 0 && (
        <div className='comments'>
          <p className='comment'>
            <span className='user_name'>singh.shares</span>
            So Nikhil Is Bigger Than Burj Khalifa 😂
          </p>
        </div>
      )}

      <span className='when_uploaded'>{`${hours}h ${minutes}m and ${seconds}s ago `}</span>

      <div className='comment_box flex'>
        <input type='text' placeholder='Add a comment...' />

        <Button
          type='button'
          bgColor='transparent'
          transform='scale(1)'
          color='#0095f6'
          fs='0.9em'
        >
          <span style={{ fontWeight: '700' }}>Post</span>
        </Button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  margin-bottom: 30px;
  border: 1px solid #c7c7c786;

  .post_top {
    justify-content: space-between;
    padding: 12px 18px;

    .left {
      .dp {
        width: 40px;
        height: 40px;
        border: 1px solid #949494;
        padding: 0.5px;
        border-radius: 50%;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
      }

      .username {
        margin-left: 15px;
        color: #333;
        font-size: 0.9em;
      }
    }

    .more_btn {
      font-size: 1.5em;
      color: #333;
    }

    .more_btn:hover {
      cursor: pointer;
    }
  }

  .hero {
    width: 100%;
    height: 600px;
    border: 1px solid #dbdbdb85;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    position: relative;

    .previous,
    .next {
      position: absolute;
      top: 50%;
      width: 0.6em;
      height: 0.6em;
      font-size: 2.2em;
      color: #252525;
      border-radius: 50%;
      background-color: #b3b3b3;
    }

    .previous {
      left: 5px;
    }

    .next {
      right: 5px;
    }
  }

  .hero:hover {
    cursor: pointer;
  }

  .btns {
    padding: 10px 10px 5px;
    justify-content: space-between;

    .btn_left {
      .ic_like,
      .ic_comment {
        font-size: 2em;
        color: #333;
      }

      .ic_like,
      .ic_comment:hover {
        cursor: pointer;
      }

      .ic_comment {
        margin-left: 15px;
      }
    }

    .btn_save {
      .ic_save,
      .ic_saved {
        font-size: 2em;
        color: #333;
      }

      .ic_save,
      .ic_saved:hover {
        cursor: pointer;
      }
    }
  }

  .likes {
    padding: 0px 0px 10px 14px;
    font-size: 0.87em;
    font-weight: 700;
    color: #344;
  }

  .username_and_caption {
    padding: 0px 0px 10px 14px;

    .caption {
      /* font-weight: 400; */
      color: #444;
      font-size: 0.84em;
      line-height: 1.4;

      .username {
        font-weight: 700;
        color: #344;
        margin-right: 5px;
      }
    }
  }

  .comments {
    padding: 0px 0px 10px 14px;
    color: #444;
    font-size: 0.84em;
    line-height: 1.4;
    margin-bottom: 1px;

    .user_name {
      font-weight: 700;
      color: #344;
      margin-right: 5px;
    }
  }

  .when_uploaded {
    padding: 0px 0px 0px 14px;
    color: #777777;
    font-size: 0.68em;
  }

  .comment_box {
    justify-content: space-between;
    padding: 20px 14px;
    margin-top: 5px;
    border-top: 1px solid #ebe9e9;

    input {
      width: 90%;
      /* border: 1px solid red; */
      background-color: transparent;
      font-size: 0.8em;
      color: #5d5d5d;
    }
  }
`;

Post.propTypes = {
  post: PropsType.object.isRequired,
};

export default Post;
