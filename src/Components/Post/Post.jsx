import styled from 'styled-components';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import FiberManualRecordRounded from '@material-ui/icons/FiberManualRecordRounded';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import PropsType from 'prop-types';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import Button from '../Button';
import dummyDp from '../../images/dummyDp.png';
import usePostLogic from './Logic/usePostLogic';

const Post = ({ post }) => {
  const { caption, comments, images, likes, userDpUrl, userName } = post;

  const {
    unSavePost,
    savePost,
    comment,
    dislikeThePost,
    didYouSavedThePost,
    likeThePost,
    didYouLikedThePost,
    showNextImage,
    showPreviousImage,
    whenWasThePostCreated,
    currentImageIndex,
    handleComment,
    postComment,
    loading,
  } = usePostLogic(post);

  return (
    <Wrapper>
      {loading && (
        <PostLoader>
          <h3>Loading...</h3>
        </PostLoader>
      )}

      <div className='post_top flex'>
        <div className='left flex'>
          <div className='dp'>
            <img src={userDpUrl === '' ? dummyDp : userDpUrl} alt='' />
          </div>

          <h3 className='username'>{userName}</h3>
        </div>

        <MoreHorizIcon className='more_btn' />
      </div>

      <div className='hero' onDoubleClick={likeThePost}>
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
          {didYouLikedThePost ? (
            <FavoriteOutlinedIcon
              className='ic_dislike'
              onClick={dislikeThePost}
            />
          ) : (
            <FavoriteBorderOutlinedIcon
              className='ic_like'
              onClick={likeThePost}
            />
          )}
          <ModeCommentOutlinedIcon className='ic_comment' />
        </div>

        {images.length > 1 && (
          <div className='which_no_of_image'>
            {images.map(({ url }, index) => (
              <FiberManualRecordRounded
                key={url}
                className={`${index === currentImageIndex && `active`} dots`}
              />
            ))}
          </div>
        )}

        <div className='btn_save'>
          {didYouSavedThePost ? (
            <BookmarkIcon className='ic_saved' onClick={unSavePost} />
          ) : (
            <BookmarkBorderOutlinedIcon
              className='ic_save'
              onClick={savePost}
            />
          )}
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
          {comments.map((item) => (
            <p className='comment' key={item.comment}>
              <span className='user_name'>{item.userName}</span>
              {item.comment}
            </p>
          ))}
        </div>
      )}

      <span className='when_uploaded'>{whenWasThePostCreated}</span>

      <div className='comment_box flex'>
        <input
          type='text'
          placeholder='Add a comment...'
          value={comment}
          onChange={handleComment}
        />

        <Button
          type='button'
          bgColor='transparent'
          color={comment ? '#0095f6' : '#92c9ee'}
          fs='0.9em'
          isDisabled={comment ? 0 : 1}
          handleClick={postComment}
          transform='scale(1)'
          transition='all 0.5s ease'
          cursorOnHover={comment ? 'pointer' : 'default'}
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
  position: relative;

  .post_top {
    justify-content: space-between;
    padding: 12px 18px;

    .left {
      .dp {
        width: 40px;
        height: 40px;
        border: 1px solid #949494;
        padding: 1px;
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
      color: #3b3b3b;
      border-radius: 50%;
      background-color: #d6d6d6;
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
    padding: 8px 10px 5px;
    justify-content: space-between;
    align-items: flex-start;
    .btn_left {
      .ic_like,
      .ic_comment {
        font-size: 2em;
        color: #333;
      }

      .ic_dislike {
        font-size: 2em;
        color: rgb(230, 57, 71);
      }

      .ic_like,
      .ic_dislike,
      .ic_comment:hover {
        cursor: pointer;
      }

      .ic_comment {
        margin-left: 15px;
      }
    }

    .dots {
      color: #8a8a8a;
      font-size: 0.6em;
    }

    .dots.active {
      color: #12a1e4;
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
      color: #6b6b6b;
      font-weight: 700;
    }
  }
`;

const PostLoader = styled.main`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: #333333;
  opacity: 0.6;
  z-index: 10;
  display: grid;
  place-items: center;

  h3 {
    color: #eeeeee;
    font-size: 2.5em;
  }
`;

Post.propTypes = {
  post: PropsType.object.isRequired,
};

export default Post;
