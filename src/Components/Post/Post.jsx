import styled from 'styled-components';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Link } from 'react-router-dom';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import FiberManualRecordRounded from '@material-ui/icons/FiberManualRecordRounded';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import PropsType from 'prop-types';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import Button from '../Button';
import dummyDp from '../../images/dummyDp.png';
import usePostLogic from './Logic/usePostLogic';

const Post = ({ post, viewPost }) => {
  const { caption, images, likes, userDpUrl, userName, userId } = post;

  const {
    unSavePost,
    closeViewPost,
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
    comments,
    showDialog,
    closeDialog,
    openDialog,
    id,
  } = usePostLogic(post);

  return (
    <>
      {showDialog && (
        <PostDialog>
          <div className='center_box flex'>
            {id !== post.userId && (
              <div className='btn_div_common'>
                <p className='unfollow'>Unfollow</p>
              </div>
            )}

            <div className='btn_div_common '>
              <p className='cancel' onClick={closeDialog}>
                cancel
              </p>
            </div>
          </div>
        </PostDialog>
      )}

      {viewPost ? (
        <ViewPost>
          {loading && (
            <PostLoader>
              <h3>Loading...</h3>
            </PostLoader>
          )}

          <div className='center_box flex'>
            <div className='images' onDoubleClick={likeThePost}>
              {images.length > 1 && (
                <>
                  <NavigateBeforeIcon
                    className='previous'
                    onClick={showPreviousImage}
                  />

                  <NavigateNextIcon className='next' onClick={showNextImage} />
                </>
              )}

              {images.length > 1 && (
                <div className='current_image_index'>
                  {images.map(({ url }, index) => (
                    <FiberManualRecordRounded
                      key={url}
                      className={`${
                        index === currentImageIndex && `active`
                      } dots`}
                    />
                  ))}
                </div>
              )}

              <img src={images[currentImageIndex].url} alt='a' />
            </div>

            <div className='right_part flex'>
              <div className='top flex '>
                <div className='flex'>
                  <div className='dp'>
                    <img src={userDpUrl === '' ? dummyDp : userDpUrl} alt='a' />
                  </div>

                  <Link
                    to={userId === id ? `/${userName}` : `/profile/${userId}/`}
                    className='username'
                  >
                    {userName}
                  </Link>
                </div>
                <MoreHorizIcon className='more_btn' onClick={openDialog} />
              </div>

              <div className='middle_part flex'>
                <div className='row use_cap_row flex'>
                  <div className='upper_section flex'>
                    <div className='dp'>
                      <img
                        src={userDpUrl === '' ? dummyDp : userDpUrl}
                        alt='a'
                      />
                    </div>

                    <div className='caption'>
                      <p>
                        <Link
                          to={
                            userId === id
                              ? `/${userName}`
                              : `/profile/${userId}/`
                          }
                          className='username'
                        >
                          {userName}
                        </Link>{' '}
                        {caption}
                      </p>
                    </div>
                  </div>

                  <p className='when_uploaded_top'>{whenWasThePostCreated}</p>
                </div>

                {comments.length !== 0 && (
                  <div className='comments'>
                    {comments.map((item) => (
                      <p className='comment flex' key={item.id}>
                        <div
                          className='dp'
                          style={{ width: '35px', height: '35px' }}
                        >
                          <img
                            src={
                              item.userDpUrl === '' ? dummyDp : item.userDpUrl
                            }
                            alt='s'
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                            }}
                          />
                        </div>

                        <Link
                          className='user_name'
                          to={
                            id === item.userId
                              ? `/${item.userName}`
                              : `/profile/${item.userId}/`
                          }
                        >
                          {item.userName}
                        </Link>
                        {item.comment}
                      </p>
                    ))}
                  </div>
                )}

                <div className='div' style={{ width: '100%' }}>
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
                      <label htmlFor='comment'>
                        <ModeCommentOutlinedIcon className='ic_comment' />
                      </label>
                    </div>

                    <div className='btn_save'>
                      {didYouSavedThePost ? (
                        <BookmarkIcon
                          className='ic_saved'
                          onClick={unSavePost}
                        />
                      ) : (
                        <BookmarkBorderOutlinedIcon
                          className='ic_save'
                          onClick={savePost}
                        />
                      )}
                    </div>
                  </div>

                  <div className='row'>
                    <div className='likes'>{likes} likes</div>
                  </div>

                  <span className='when_uploaded'>{whenWasThePostCreated}</span>

                  <div className='comment_box flex'>
                    <input
                      type='text'
                      placeholder='Add a comment...'
                      value={comment}
                      onChange={handleComment}
                      id='comment'
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
                </div>
              </div>
            </div>
          </div>
          {/*  */}

          <CloseOutlined className='ic_close' onClick={closeViewPost} />
        </ViewPost>
      ) : (
        <Wrapper className={viewPost && 'flex'}>
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

              <Link
                to={userId === id ? `/${userName}` : `/profile/${userId}/`}
                className='username'
              >
                {userName}
              </Link>
            </div>

            {id !== post.userId && (
              <MoreHorizIcon className='more_btn' onClick={openDialog} />
            )}
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

              <label htmlFor='comment'>
                <ModeCommentOutlinedIcon className='ic_comment' />
              </label>
            </div>

            {images.length > 1 && (
              <div className='which_no_of_image'>
                {images.map(({ url }, index) => (
                  <FiberManualRecordRounded
                    key={url}
                    className={`${
                      index === currentImageIndex && `active`
                    } dots`}
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
                <p className='comment' key={item.id}>
                  <Link
                    className='user_name'
                    to={
                      id === item.userId
                        ? `/${item.userName}`
                        : `/profile/${item.userId}/`
                    }
                  >
                    {item.userName}
                  </Link>
                  {item.comment}

                  {/* <div className='dp' style={{ width: '20px', height: '20px' }}>
                  <img
                    src={item.userDpUrl === '' ? dummyDp : item.userDpUrl}
                    alt='s'
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                    }}
                  />
                </div> */}
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
              id='comment'
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
      )}
    </>
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
        font-weight: 700;
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
      object-fit: contain;
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

const PostDialog = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-content: center;
  z-index: 16;
  overflow-y: auto;

  .center_box {
    width: 29vw;
    height: auto;
    background-color: #fbfbfb;
    border-radius: 12px;
    flex-direction: column;
    justify-content: flex-start;
    color: #333;
    font-size: 0.95em;
  }

  .heading {
    width: 100%;
    font-size: 1.2em;
    padding: 22px 0;
    border-bottom: 1px solid #cac9c9;
    text-align: center;
  }

  .btn_div_common {
    /* padding: 14px 0; */
    border-bottom: 1px solid #cac9c9;
    width: 100%;
    text-align: center;

    .unfollow {
      color: #cc3333;
    }

    .unfollow,
    .go_to_post,
    .cancel {
      display: inline-block;
      padding: 15px 0;
      width: 100%;
      font-size: 0.9em;
      font-weight: 700;
    }

    .unfollow,
    .go_to_post,
    .cancel:hover {
      cursor: pointer;
    }
  }
`;

const ViewPost = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: grid;
  place-content: center;
  z-index: 15;

  .center_box {
    width: 70vw;
    font-size: 0.95em;

    .images {
      width: 500px;
      height: 500px;
      position: relative;
      background: rgba(107, 107, 107, 0.6);
      :hover {
        cursor: pointer;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }

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

      .current_image_index {
        position: absolute;
        bottom: 0px;
        left: 50%;

        .dots {
          color: #8a8a8a;
          font-size: 0.6em;
        }

        .dots.active {
          color: #12a1e4;
        }
      }
    }

    .right_part {
      background-color: #e4e4e4;
      height: 100%;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;

      .dp {
        width: 40px;
        height: 40px;
        margin-right: 10px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      .username {
        font-weight: 700;
        color: #292929;
      }

      .top {
        border-bottom: 1px solid #d6d5d5;
        padding: 15px 15px;
        width: 100%;
        justify-content: space-between;

        .more_btn {
          font-size: 1.5em;
          color: #333;
        }
      }

      .middle_part {
        padding: 12px 15px;
        height: 88%;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;

        .use_cap_row {
          font-size: 0.97em;
          padding-top: 10px;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;

          .caption {
            .username {
            }

            color: #292929;

            width: 90%;
          }
        }

        .when_uploaded_top {
          color: #969696;
          padding: 8px 0 0 50px;
          font-size: 0.9em;
        }

        .comments {
          color: #444;
          font-size: 0.95em;
          line-height: 1.4;
          margin-top: 12px;
          border-bottom: 1px solid #d6d5d5;
          overflow-y: scroll;
          height: 230px;
          width: 100%;

          .comment {
            padding: 0 0 12px;
            justify-content: flex-start;
            margin-bottom: 5px;
          }

          .user_name {
            margin-right: 5px;
            font-weight: 700;
            color: #111111;
          }
        }

        .btns {
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
          margin-top: 10px;

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
          padding: 0px 0;
          margin-top: 5px;
          font-size: 0.9em;
          font-weight: 700;
          color: #344;
          width: 100%;
        }

        .when_uploaded {
          width: 100%;
          padding: 0;
          color: #7c7c7c;
          font-size: 0.8em;
        }

        .comment_box {
          width: 100%;
          justify-content: space-between;
          margin-top: 5px;
          border-top: 1px solid #ebe9e9;

          input {
            width: 90%;
            /* border: 1px solid red; */
            background-color: transparent;
            font-size: 0.9em;
            color: #6b6b6b;
            font-weight: 700;
            padding: 10px 0;
          }
        }
      }
    }
  }

  .ic_close {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #e7e7e7;
    font-size: 2.2em;
  }

  .ic_close:hover {
    cursor: pointer;
  }
`;

Post.propTypes = {
  post: PropsType.object.isRequired,
  viewPost: PropsType.bool,
};

Post.defaultProps = {
  viewPost: false,
};

export default Post;
