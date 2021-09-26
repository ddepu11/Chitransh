import styled from 'styled-components';
import HomeIcon from '@material-ui/icons/Home';
import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { Link } from 'react-router-dom';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import Button from '../../Components/Button';
import dummyDp from '../../images/dummyDp.png';
import CreatePost from '../Create/CreatePost';
import useNavbarLogic from './Logic/useNavbarLogic';

const Navbar = () => {
  const {
    handleCloseCreatePost,
    handleLogOut,
    handleActiveIcon,
    activeIcon,
    dropDownFromAvatar,
    info,
    handleCloseAvatarDrop,
    setActiveIcon,
    notificationDropDown,
    loading,
    notifications,
  } = useNavbarLogic();

  return (
    <>
      {activeIcon === 'add' && (
        <CreatePost handleCloseCreatePost={handleCloseCreatePost} />
      )}

      <Wrapper activeIcon={activeIcon}>
        <div className='w-960 nav_center_div flex'>
          <Link to='/' onClick={() => setActiveIcon('home')}>
            <h1 className='instagram'>Chitransh</h1>
          </Link>

          <div className='search'>
            <input
              type='text'
              name='searchTerm'
              placeholder='&#128269;&nbsp;Search'
            />
          </div>

          <div className='far_right flex'>
            {activeIcon === 'home' ? (
              <Link to='/' className='link_home'>
                <HomeIcon className='ic_home' />
              </Link>
            ) : (
              <Link to='/' className='link_home'>
                <HomeOutlinedIcon
                  className='ic_home'
                  data-icon='home'
                  onClick={handleActiveIcon}
                />
              </Link>
            )}

            {activeIcon === 'like' ? (
              <FavoriteOutlinedIcon className='ic_liked' />
            ) : (
              <FavoriteBorderOutlinedIcon
                className='ic_liked'
                data-icon='like'
                onClick={handleActiveIcon}
              />
            )}

            {activeIcon === 'add' ? (
              <AddPhotoAlternate className='ic_add' />
            ) : (
              <AddPhotoAlternateOutlinedIcon
                className='ic_add'
                data-icon='add'
                onClick={handleActiveIcon}
              />
            )}

            <div className='avatar'>
              <img
                src={info.dp.fileName === 'dummyDp' ? dummyDp : info.dp.url}
                alt='pravatar'
                onClick={handleActiveIcon}
                tabIndex='0'
                className='ava_img'
                data-icon='avatar'
              />
            </div>

            <div ref={notificationDropDown} className='notification_box'>
              {loading ? (
                <div className='notification_loading flex'>
                  <h3>Loading...</h3>
                </div>
              ) : (
                <>
                  {notifications.length === 0 ? (
                    <div className='no_notification flex'>
                      <h2>There are no notifications !</h2>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div key={item.createdOn} className='notification flex'>
                        <div className='left flex'>
                          <div className='sender_dp'>
                            <img src={item.whoMade.userDpUrl} alt='sender' />
                          </div>

                          <h3 className='user_name'>{item.whoMade.userName}</h3>
                          <div className='body'>{item.body.slice(0, 30)}</div>
                        </div>

                        <div className='right'>
                          <div className='post_img'>
                            <img src={item.postImg} alt='post' />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>

            {/* The Avatar box */}
            <div ref={dropDownFromAvatar} className='the_avatar_box'>
              <Link
                to={`/${info.userName}`}
                className='profile flex'
                onClick={handleCloseAvatarDrop}
              >
                <AccountCircleRoundedIcon className='ic_profile' />
                <span>Profile</span>
              </Link>

              <Link
                to={`/${info.userName}/saved/`}
                className='saved flex'
                onClick={handleCloseAvatarDrop}
              >
                <BookmarkBorderOutlinedIcon className='ic_saved' />
                <span>Saved</span>
              </Link>

              <Button
                type='button'
                padding='10px'
                bgColor='transparent'
                width='100%'
                bSh=''
                color='#333'
                handleClick={handleLogOut}
                transform='scale(1)'
              >
                <span>Log Out</span>
              </Button>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.nav`
  padding: 10px 0;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  position: sticky;
  top: 0px;
  background-color: #fff;
  z-index: 11;

  .instagram {
    font-family: 'Cookie', cursive;
    font-size: 2.2em;
    letter-spacing: 3px;
    color: #233;
  }

  .instagram:hover {
    cursor: pointer;
  }

  .nav_center_div {
    justify-content: space-between;
  }

  .search {
    input {
      border: 1px solid #bdbcbc99;
      background: #f3f1f199;
      padding: 5px 20px;
      font-size: 0.8em;
      border-radius: 5px;
    }
  }

  .far_right {
    justify-content: space-between;
    width: 22%;
    /* border: 1px solid red; */
    position: relative;

    .ic_home,
    .ic_liked,
    .ic_add {
      font-size: 1.75em;
      color: #343f3f;
    }

    .ic_liked,
    .ic_add:hover {
      cursor: pointer;
    }
  }

  .link_home {
    color: #344;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    transition: all 0.3s ease;
    border: ${({ activeIcon }) =>
      activeIcon === 'avatar' ? '2px solid #333' : ''};
    padding: ${({ activeIcon }) => (activeIcon === 'avatar' ? '1px' : '0px')};

    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .avatar:hover {
    cursor: pointer;
  }

  .notification_box,
  .the_avatar_box {
    position: absolute;
    top: calc(100% + 0.25rem);
    right: 0;
    color: #333;
    background-color: white;
    border-radius: 0.25rem;
    box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, 0.1);
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.5s ease, transform 0.5s ease;
    pointer-events: none;
  }

  .notification_box {
    width: 520px;
    padding: 15px 10px 10px;

    .notification_loading {
      height: 70px;

      h3 {
        font-size: 1.2em;
        letter-spacing: 1px;
        color: #646464;
      }
    }

    .no_notification {
      height: 70px;

      h2 {
        font-size: 1.1em;
        letter-spacing: 1px;
        color: #646464;
      }
    }

    .notification {
      margin-bottom: 20px;
      justify-content: space-between;
      /* align-items: flex-start; */

      .sender_dp {
        width: 45px;
        height: 45px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
      }

      .user_name {
        font-size: 0.8em;
        letter-spacing: 1px;
        color: #3f3f3f;
        margin-left: 10px;
      }

      .body {
        font-size: 0.8em;
        letter-spacing: 1px;
        color: #3f3f3f;
        margin-left: 5px;
      }

      .post_img {
        width: 45px;
        height: 45px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .the_avatar_box {
    width: 250px;

    .profile,
    .saved {
      justify-content: flex-start;
      padding: 10px 12px;
      font-size: 1em;
    }

    .profile,
    .saved {
      color: #333;
    }

    .profile:hover {
      cursor: pointer;
      background-color: #f0eeee99;
    }

    .saved {
      border-bottom: 1px solid #d6d6d6;
    }

    .saved:hover {
      cursor: pointer;
      background-color: #f0eeee99;
    }

    .ic_profile {
      font-size: 1.2em;
      margin-right: 10px;
    }

    .ic_saved {
      font-size: 1.2em;
      margin-right: 10px;
    }

    .logout {
      border-top: 1px solid #dfdfdf;
      padding: 10px 14px;
    }
    .logout:hover {
      cursor: pointer;
      background-color: #f0eeee99;
    }
  }

  .the_avatar_box.active,
  .notification_box.active {
    opacity: 1;
    transform: translateY(0px);
    pointer-events: auto;
  }
`;

export default Navbar;
