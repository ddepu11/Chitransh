import GridOnOutlinedIcon from '@material-ui/icons/GridOnOutlined';
import ClearIcon from '@material-ui/icons/Clear';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import styled from 'styled-components';
import { Link, Route } from 'react-router-dom';
import Button from '../../Components/Button';
import useProfileLogic from './Logic/useProfileLogic';
import dummyDp from '../../images/dummyDp.png';
import Loader from '../../Components/Loader';
import Saved from './Saved/Saved';
import UserPosts from '../Posts/UserPosts';
import CircleLoader from '../../Components/CircleLoader';

const Profile = () => {
  const {
    info,
    openChangeDpDialog,
    handlingChangeDp,
    cancelChangeDp,
    handleDpChange,
    userLoading,
    removeDp,
    closeDialog,
    postsLinkRef,
    savedLinkRef,
    myPosts,
    loading,
    profile,
    userId,
    personPosts,
    unfollowAPerson,
    followAPerson,
    amIFollingProfilePerson,
    following,
    followers,
    dialogToView,
    closeFollowDialog,
    handleFollowingFollwersDialog,
    id,
    followUnfollowLoading,
    dpLoading,
  } = useProfileLogic();

  const isProfileEmpty = Object.keys(profile).length === 0;

  let imageErc = dummyDp;

  if (userId && !isProfileEmpty) {
    if (profile.dp.fileName !== 'dummyDp') {
      imageErc = profile.dp.url;
    }
  } else if (info.dp.fileName !== 'dummyDp') {
    imageErc = info.dp.url;
  }

  let bio = '';
  if (userId) {
    if (profile.bio) {
      bio = profile.bio;
    }
  } else if (info.bio) {
    bio = info.bio;
  }

  let website = '';

  if (userId) {
    if (profile.website) {
      website = profile.website;
    }
  } else if (info.website) {
    website = info.website;
  }

  if (userLoading) {
    return <Loader />;
  }

  return (
    <>
      {handlingChangeDp && !userId && (
        <ChangeDpDialog onClick={closeDialog} className='ChangeDpDialog'>
          <div className='center_box flex'>
            <h2 className='heading'>Change Profile Photo</h2>

            <div className='btn'>
              <label htmlFor='dp' className='upload_label_btn'>
                Upload Photo
              </label>

              <input
                type='file'
                accept='.jpg, .jpeg, .png'
                id='dp'
                style={{ display: 'none' }}
                onChange={handleDpChange}
              />
            </div>

            {info.dp.fileName !== 'dummyDp' && (
              <div className='btn'>
                <Button
                  type='button'
                  bSh=''
                  transform='scale(1)'
                  bgColor='transparent'
                  padding='14px 0'
                  width='100%'
                  color='#ee1f1f'
                  fWeight='700'
                  fs='0.9em'
                  handleClick={removeDp}
                >
                  Remove Current Photo
                </Button>
              </div>
            )}

            <div className='btn cancel'>
              <Button
                type='button'
                bSh=''
                transform='scale(1)'
                bgColor='transparent'
                width='100%'
                padding='14px 00'
                color='#000'
                fWeight='400'
                fs='0.9em'
                handleClick={cancelChangeDp}
              >
                Cancel
              </Button>
            </div>
          </div>
        </ChangeDpDialog>
      )}

      {dialogToView === 'followers' && followers.length !== 0 && (
        <ViewFollowers>
          <div className='center_box'>
            <div className='top_part'>
              <h1>Followers</h1>
              <ClearIcon className='ic_close' onClick={closeFollowDialog} />
            </div>

            <div className='hero'>
              {followers.map((item) => (
                <div className='user flex' key={item.id}>
                  <div className='details flex'>
                    <div className='dp'>
                      <img
                        src={item.dp.url === '' ? dummyDp : item.dp.url}
                        alt={item.userName}
                      />
                    </div>

                    <div className='username_fullname'>
                      <Link
                        to={`/profile/${item.docId}/`}
                        onClick={closeFollowDialog}
                      >
                        {item.userName}
                      </Link>

                      <span>{item.fullName}</span>
                    </div>
                  </div>

                  {/* <Button
                    type='button'
                    bgColor='#0095f6'
                    bSh=''
                    transform='scale(1)'
                    fs='0.87'
                    color='#ffffff'
                    padding='7px 14px'
                    borderRadius='5px'
                    fWeight='700'
                  >
                    Unfollow
                  </Button> */}
                </div>
              ))}
            </div>
          </div>
        </ViewFollowers>
      )}

      {dialogToView === 'following' && following.length !== 0 && (
        <ViewFollowing>
          <div className='center_box'>
            <div className='top_part'>
              <h1>Following</h1>
              <ClearIcon className='ic_close' onClick={closeFollowDialog} />
            </div>

            <div className='hero'>
              {following.map((item) => (
                <div className='user flex' key={item.id}>
                  <div className='details flex'>
                    <div className='dp'>
                      <img
                        src={item.dp.url === '' ? dummyDp : item.dp.url}
                        alt={item.userName}
                      />
                    </div>

                    <div className='username_fullname'>
                      <Link
                        to={`/profile/${item.docId}/`}
                        onClick={closeFollowDialog}
                      >
                        {item.userName}
                      </Link>

                      <span>{item.fullName}</span>
                    </div>
                  </div>

                  {info.following.includes(item.docId) ? (
                    <Button
                      type='button'
                      bgColor='#0095f6'
                      bSh=''
                      transform='scale(1)'
                      fs='0.8em'
                      color='#ffffff'
                      padding='5px 10px'
                      borderRadius='5px'
                      fWeight='700'
                      dataVal={item.docId}
                      handleClick={unfollowAPerson}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <>
                      {item.docId !== id && (
                        <Button
                          type='button'
                          bgColor='#0095f6'
                          bSh=''
                          transform='scale(1)'
                          fs='0.8em'
                          color='#ffffff'
                          padding='5px 10px'
                          borderRadius='5px'
                          fWeight='700'
                          dataVal={item.docId}
                          handleClick={followAPerson}
                        >
                          follow
                        </Button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ViewFollowing>
      )}

      <Wrapper className='w-960' userId={userId}>
        <div className='dp_and_details flex'>
          <div className='dp' onClick={openChangeDpDialog}>
            {dpLoading ? (
              <CircleLoader
                wrapperMargin='auto 0'
                wrapperH='100%'
                cirH='30px'
                cirW='30px'
              />
            ) : (
              <img src={imageErc} alt='dp' />
            )}
          </div>

          <div className='details'>
            <div className='top flex'>
              <h3 className='username'>
                {userId ? profile.userName : info.userName}
              </h3>

              {!userId && (
                <Link to='/accounts/edit/'>
                  <Button
                    type='button'
                    borderRadius='5px'
                    padding='5px 10px'
                    margin='0 0 0 22px'
                    fs='0.95em'
                    bgColor='transparent'
                    color='#333'
                    bSh='rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset'
                    transform='scale(1)'
                  >
                    Edit Profile
                  </Button>
                </Link>
              )}

              {userId && amIFollingProfilePerson && (
                <>
                  {followUnfollowLoading ? (
                    <CircleLoader wrapperMargin='0 0 0 40px' />
                  ) : (
                    <Button
                      type='button'
                      borderRadius='5px'
                      padding='5px 10px'
                      margin='0 0 0 22px'
                      fs='0.95em'
                      bgColor='#c51d07ee'
                      color='#ffffff'
                      bSh=''
                      transform='scale(1)'
                      handleClick={unfollowAPerson}
                      dataVal={profile.personDocId}
                    >
                      Unfollow
                    </Button>
                  )}
                </>
              )}

              {userId && !amIFollingProfilePerson && (
                <>
                  {followUnfollowLoading ? (
                    <CircleLoader wrapperMargin='0 0 0 40px' />
                  ) : (
                    <Button
                      type='button'
                      borderRadius='5px'
                      padding='5px 10px'
                      margin='0 0 0 22px'
                      fs='0.95em'
                      bgColor='#0095f6'
                      color='#f5f5f5'
                      bSh=''
                      transform='scale(1)'
                      handleClick={followAPerson}
                      dataVal={profile.personDocId}
                    >
                      follow
                    </Button>
                  )}
                </>
              )}
            </div>

            <div className='middle flex'>
              <div className='posts flex'>
                <h3>{!isProfileEmpty ? personPosts.length : myPosts.length}</h3>
                <span>posts</span>
              </div>

              <div className='followers flex'>
                <h3
                  data-view='followers'
                  onClick={handleFollowingFollwersDialog}
                >
                  {!isProfileEmpty
                    ? profile.followers.length
                    : info.followers.length}
                  <span className='heading'>followers</span>
                </h3>
              </div>

              {followUnfollowLoading ? (
                <CircleLoader wrapperMargin='0 0 0 20px' />
              ) : (
                <div className='following flex'>
                  <h3
                    data-view='following'
                    onClick={handleFollowingFollwersDialog}
                  >
                    {!isProfileEmpty
                      ? profile.following.length
                      : info.following.length}
                    <span className='heading'>following</span>
                  </h3>
                </div>
              )}
            </div>

            <div className='bottom flex'>
              <h2 className='name'>
                {!isProfileEmpty ? profile.fullName : info.fullName}
              </h2>

              {bio && <span className='bio_text'>{bio}</span>}

              {website && (
                <a
                  href={website}
                  className='bio_website'
                  target='_blank'
                  rel='noreferrer'
                >
                  {website.includes('https')
                    ? website.slice(8)
                    : website.slice(7)}
                </a>
              )}
            </div>
          </div>
        </div>

        <nav className='flex'>
          <Link
            to={
              !isProfileEmpty ? `/profile/${profile.email}` : `/${info.email}/`
            }
            className={!isProfileEmpty ? `active posts flex` : 'posts flex'}
            ref={postsLinkRef}
          >
            <GridOnOutlinedIcon className='ic_posts' />
            <span>POSTS</span>
          </Link>

          {!userId && (
            <Link
              to={`/${info.email}/saved/`}
              className='saved  flex'
              ref={savedLinkRef}
            >
              <BookmarkBorderOutlinedIcon className='ic_saved' />
              <span>SAVED</span>
            </Link>
          )}
        </nav>

        {/*  */}
        <Route path='/profile/:userId' exact>
          <UserPosts
            posts={personPosts}
            loading={loading}
            viewingAProfile={true}
          />
        </Route>

        <Route path='/:userName/' exact>
          <UserPosts posts={myPosts} loading={loading} />
        </Route>

        <Route path='/:userName/saved/' exact>
          <Saved info={info} />
        </Route>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.main`
  padding: 40px 5px 20px;

  .dp_and_details {
    justify-content: flex-start;
    padding: 0 60px 30px;
    align-items: flex-start;
    border-bottom: 1px solid #c7c7c786;

    .dp {
      width: 160px;
      height: 160px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .dp:hover {
      cursor: ${({ userId }) => !userId && 'pointer'};
    }

    .dp:hover::after {
      content: 'Change profile photo';
      background-color: #333;
      color: #f3f0f0;
      border-radius: 5px;
      top: 20px;
      right: 00px;
      position: absolute;

      font-size: ${({ userId }) => (!userId ? '0.8em' : '0')};
      padding: ${({ userId }) => (!userId ? '4px 5px' : '0')};
    }

    .details {
      margin-left: 110px;

      .top,
      .middle {
        justify-content: flex-start;
      }

      .top {
        .username {
          font-size: 1.7em;
          font-weight: 200;
          color: #666;
        }
      }

      .middle {
        padding: 22px 0;

        .posts,
        .followers,
        .following {
          h3 {
            color: #444;
            font-size: 0.95em;
            font-weight: 600;
          }

          .heading,
          span {
            margin-left: 6px;
            color: #444;
            font-size: 0.92em;
            font-weight: 400;
          }
        }

        .followers {
          margin: 0 40px;
        }

        .followers,
        .following:hover {
          cursor: pointer;
        }
      }

      .bottom {
        flex-direction: column;
        align-items: flex-start;

        .name {
          font-size: 1em;
          color: #344;
          margin-bottom: 2px;
        }

        .bio_text {
          color: #344;
          font-size: 0.95em;
        }

        .bio_website {
          color: #00376b;
          font-size: 0.9em;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
      }
    }
  }

  nav {
    color: #a5a4a4;

    .posts {
      margin-right: 50px;
      padding: 20px 0;
      color: #a5a4a4;
    }
    .saved {
      padding: 20px 0;
      color: #a5a4a4;
    }

    .posts,
    .saved:hover {
      cursor: pointer;
    }

    .posts.active,
    .saved.active {
      color: #414141;
      border-top: 1px solid #2e2e2e;
    }

    .ic_posts,
    .ic_saved {
      font-size: 0.9em;
      margin-right: 5px;
    }

    span {
      font-size: 0.8em;
      letter-spacing: 1px;
      font-weight: 700;
    }
  }
`;

const ChangeDpDialog = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: grid;
  place-content: center;
  z-index: 15;

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

  .btn {
    /* padding: 14px 0; */
    border-bottom: 1px solid #cac9c9;
    width: 100%;
    text-align: center;

    .upload_label_btn {
      display: inline-block;
      padding: 15px 0;
      width: 100%;
      font-size: 0.9em;
      font-weight: 700;
      color: #0095f6;
    }

    .upload_label_btn:hover {
      cursor: pointer;
    }
  }

  .cancel {
    border-bottom: none;
  }
`;

const ViewFollowers = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: grid;
  place-content: center;
  z-index: 15;

  .center_box {
    width: 30vw;
    height: auto;
    background-color: #fbfbfb;
    border-radius: 12px;
    flex-direction: column;
    justify-content: flex-start;
    color: #333;
    font-size: 0.95em;

    .top_part {
      position: relative;
      padding: 10px 0;
      border-bottom: 1px solid #bebebe;

      h1 {
        text-align: center;
        font-size: 1em;
        color: #464545;
      }

      .ic_close {
        position: absolute;
        top: 9px;
        right: 10px;
        font-size: 2em;
      }

      .ic_close:hover {
        cursor: pointer;
      }
    }

    .hero {
      height: 400px;
      overflow-y: scroll;
      padding: 10px 20px 0;

      .user {
        padding: 10px 0px;
        justify-content: space-between;
      }

      .details {
        .dp {
          width: 38px;
          height: 38px;
          margin-right: 15px;
          padding: 1px;
          border: 2px solid #e42e2e;
          border-radius: 50%;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
        }

        .username_fullname {
          a {
            font-weight: 700;
            color: #333;
            font-size: 0.9em;
            display: block;
          }
          span {
            color: #797979;
            font-size: 0.9em;
          }
        }
      }
    }
  }
`;

const ViewFollowing = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: grid;
  place-content: center;
  z-index: 15;

  .center_box {
    width: 30vw;
    height: auto;
    background-color: #fbfbfb;
    border-radius: 12px;
    flex-direction: column;
    justify-content: flex-start;
    color: #333;
    font-size: 0.95em;

    .top_part {
      position: relative;
      padding: 10px 0;
      border-bottom: 1px solid #bebebe;

      h1 {
        text-align: center;
        font-size: 1em;
        color: #464545;
      }

      .ic_close {
        position: absolute;
        top: 9px;
        right: 10px;
        font-size: 2em;
      }

      .ic_close:hover {
        cursor: pointer;
      }
    }

    .hero {
      height: 400px;
      overflow-y: scroll;
      padding: 10px 20px 0;

      .user {
        padding: 10px 0px;
        justify-content: space-between;
      }

      .details {
        .dp {
          width: 38px;
          height: 38px;
          margin-right: 15px;
          padding: 1px;
          border: 2px solid #e42e2e;
          border-radius: 50%;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
        }

        .username_fullname {
          a {
            font-weight: 700;
            color: #333;
            font-size: 0.9em;
            display: block;
          }
          span {
            color: #797979;
            font-size: 0.9em;
          }
        }
      }
    }
  }
`;

export default Profile;
