import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { Link } from 'react-router-dom';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import Button from '../../Components/Button';
import { authInstance } from '../../config/firebase';
import {
  notificationShowError,
  notificationShowInfo,
} from '../../features/notification';
import { userLoadingEnds } from '../../features/user';

const Navbar = () => {
  const dispatch = useDispatch();
  const [activeIcon, setActiveIcon] = useState('home');

  const handleActiveIcon = (e) => {
    const icon = e.currentTarget.getAttribute('data-icon');
    setActiveIcon(icon);
  };

  const handleLogOut = () => {
    authInstance
      .signOut()
      .then(() => {
        dispatch(notificationShowInfo({ msg: 'Successfully logged out' }));
      })
      .catch((err) => {
        dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));
        dispatch(userLoadingEnds());
      });
  };

  return (
    <Wrapper activeIcon={activeIcon}>
      <div className='w-960 nav_center_div flex'>
        <Link to='/'>
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
            <AddBoxIcon className='ic_add' />
          ) : (
            <AddBoxOutlinedIcon
              className='ic_add'
              data-icon='add'
              onClick={handleActiveIcon}
            />
          )}

          <div className='avatar' onClick={handleActiveIcon} data-icon='avatar'>
            <img src='https://i.pravatar.cc/300' alt='pravatar' />
          </div>

          <div className='the_box'>
            <div className='profile flex'>
              <AccountCircleRoundedIcon className='ic_profile' />
              <span>Profile</span>
            </div>

            <div className='saved flex'>
              <BookmarkBorderOutlinedIcon className='ic_saved' />
              <span>Saved</span>
            </div>

            <Button
              type='button'
              padding='10px'
              bgColor='transparent'
              width='100%'
              bSh=''
              color='#333'
              handleClick={handleLogOut}
            >
              <span>Log Out</span>
            </Button>
          </div>

          <div className='tool_tip' />
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  /* border: 1px solid red; */
  padding: 10px 0;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;

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
      /* border: ${({ activeIcon }) =>
        activeIcon === 'avatar' ? '0.01px solid #444' : ''}; */
    }
  }

  .avatar:hover {
    cursor: pointer;
  }

  .the_box {
    position: absolute;
    top: 44px;
    width: 250px;
    color: #333;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em,
      rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em,
      rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;

    .profile,
    .saved {
      justify-content: flex-start;
      padding: 10px 12px;
      font-size: 1em;
    }

    .profile:hover {
      cursor: pointer;
      background-color: #f0eeee99;
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

  .tool_tip {
    position: absolute;
    right: 8px;
    top: 36px;
    width: 20px;
    height: 20px;
    transform: rotate(44deg);
    background-color: #ffffff;
  }
`;

export default Navbar;
