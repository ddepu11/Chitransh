import styled from 'styled-components';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import Button from '../Button';

const Post = () => {
  console.log('Post');

  return (
    <Wrapper>
      <div className='post_top flex'>
        <div className='left flex'>
          <div className='dp'>
            <img src='https://i.pravatar.cc/300' alt='' />
          </div>

          <h3 className='username'>ddepu11</h3>
        </div>

        <MoreHorizIcon className='more_btn' />
      </div>

      <div className='hero'>
        <img src='https://i.pravatar.cc/300' alt='s' />
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
      <div className='likes'>1,267 likes</div>

      <div className='username_and_caption'>
        <p className='caption'>
          <span className='username'>ddepu11</span>
          It&apos;s famous for its roundabouts and statues of concrete cows. But
          the English town of Milton Keynes now has another claim to fame -- a
          trundling army of shopping delivery robots. The six-wheeled automated
          vehicles, launched three years ago, barely get a second glance as they
          ply the residential streets, some 80 kilometres north of London.
        </p>
      </div>

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

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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

  .comment_box {
    justify-content: space-between;
    padding: 20px 14px;
    margin-top: 14px;
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

export default Post;
