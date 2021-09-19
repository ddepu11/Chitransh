import styled from 'styled-components';
import HomeIcon from '@material-ui/icons/Home';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { Link } from 'react-router-dom';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useState } from 'react';

const Navbar = () => {
  const [activeIcon, setActiveIcon] = useState('home');

  const handleActiveIcon = (e) => {
    const icon = e.currentTarget.getAttribute('data-icon');
    setActiveIcon(icon);
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
      activeIcon === 'avatar' ? '2px solid #222' : ''};
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
`;

export default Navbar;
