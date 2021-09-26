import styled from 'styled-components';
import PropTypes from 'prop-types';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ModeCommentRoundedIcon from '@material-ui/icons/ModeCommentRounded';
import Loader from '../../Components/Loader';

const UserPosts = ({ posts, loading }) => {
  if (loading) {
    return <Loader />;
  }

  return (
    <Wrapper>
      {posts &&
        posts.map((item) => (
          <div className='post' key={item.id}>
            <img src={item.images[0].url} alt={item.caption} />

            <div className='post_cover flex'>
              <div className='like flex'>
                <FavoriteIcon className='ic_likes' />
                <span>{item.likes}</span>
              </div>

              <div className='comments flex'>
                <ModeCommentRoundedIcon className='ic_comment' />
                <span>{item.comments.length}</span>
              </div>
            </div>
          </div>
        ))}
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 5px 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px 15px;

  .post {
    width: 300px;
    height: 300px;
    border: 1px solid #dfdfdf;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .post_cover {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: #222;
      opacity: 0;
      transition: opacity 0.4s ease-in-out;

      .like {
        margin-right: 20px;
      }

      .like,
      .comments {
        span {
          color: #ffffff;
          font-size: 1.2em;
          margin-left: 4px;
        }
      }

      .ic_likes,
      .ic_comment {
        color: #ffffff;
        font-size: 1.8em;
      }
    }
  }

  .post:hover {
    cursor: pointer;
  }

  .post:hover .post_cover {
    opacity: 0.7;
  }
`;

UserPosts.propTypes = {
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default UserPosts;
