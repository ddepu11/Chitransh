import styled from 'styled-components';
import PropTypes from 'prop-types';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ModeCommentRoundedIcon from '@material-ui/icons/ModeCommentRounded';
import { useDispatch } from 'react-redux';
import { collection, where, query, getDocs } from 'firebase/firestore';
import Loader from '../../Components/Loader';
import { viewPost } from '../../features/post';
import { notificationShowError } from '../../features/notification';
import { firestoreInstance } from '../../config/firebase';

const UserPosts = ({ posts, loading, savedPosts, viewingAProfile }) => {
  const dispatch = useDispatch();

  const viewPostDialog = async (e) => {
    const postId = e.target.getAttribute('data-id');

    try {
      const postsRef = collection(firestoreInstance, 'posts');

      const q = query(postsRef, where('id', '==', postId));
      const postSnap = await getDocs(q);

      postSnap.forEach((doc) => {
        dispatch(viewPost(doc.data()));
      });
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Wrapper>
      {posts.length !== 0 ? (
        posts.map((item) => (
          <div className='post' key={item.id}>
            <img src={item.images[0].url} alt={item.caption} />

            <div
              className='post_cover flex'
              data-id={item.id}
              onClick={viewPostDialog}
            >
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
        ))
      ) : (
        <div className='no_posts_div flex'>
          <h3>
            {savedPosts
              ? `${
                  viewingAProfile ? 'This person' : 'You'
                } haven't saved any post yet!`
              : `${
                  viewingAProfile ? 'This person' : 'You'
                } haven't posted anything yet!`}
          </h3>
        </div>
      )}
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

  .no_posts_div {
    /* border: 1px solid red; */
    width: 100%;
    height: 30vh;
    color: #646464;
    letter-spacing: 1px;
    font-size: 0.9em;
  }
`;

UserPosts.propTypes = {
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  savedPosts: PropTypes.bool,
  viewingAProfile: PropTypes.bool,
};

UserPosts.defaultProps = {
  savedPosts: false,
  viewingAProfile: false,
};

export default UserPosts;
