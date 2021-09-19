import styled from 'styled-components';
import HomeIcon from '@material-ui/icons/Home';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { Link } from 'react-router-dom';

const Navbar = () => {
  console.log('Navbar');

  return (
    <Wrapper>
      <div className='w-960 nav_center_div flex'>
        <h1 className='instagram'>Chitransh</h1>

        <div className='search'>
          <input type='text' name='searchTerm' />
        </div>

        <div className='far_right'>
          <Link to='/'>
            <HomeIcon />
          </Link>
          <FavoriteBorderOutlinedIcon />
          <AddBoxOutlinedIcon />
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  .instagram {
    font-family: 'Cookie', cursive;
    font-size: 2em;
    letter-spacing: 3px;
    color: #233;
  }

  .instagram:hover {
    cursor: default;
  }

  .nav_center_div {
    justify-content: space-between;
    padding: 10px 0;
    border: 1px dashed #555;
  }
`;

export default Navbar;
