import GridOnOutlinedIcon from '@material-ui/icons/GridOnOutlined';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import styled from 'styled-components';
import Button from '../../Components/Button';
import useProfileLogic from './Logic/useProfileLogic';
import dummyDp from '../../images/dummyDp.png';

const Profile = () => {
  const { info } = useProfileLogic();

  return (
    <Wrapper className='w-960'>
      <div className='dp_and_details flex'>
        <div className='dp'>
          <img src={info.dp.fileName === 'dummyDp' && dummyDp} alt='dp' />
        </div>

        <div className='details'>
          <div className='top flex'>
            <h3 className='username'>ddepu11</h3>
            <Button
              type='button'
              borderRadius='5px'
              padding='5px 10px'
              margin='0 0 0 22px'
              fs='0.95em'
              bgColor='transparent'
              color='#333'
              bSh='rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset'
              transform=''
            >
              Edit Profile
            </Button>
          </div>

          <div className='middle flex'>
            <div className='posts flex'>
              <h3>65</h3>
              <span>posts</span>
            </div>

            <div className='followers flex'>
              <h3>140</h3>
              <span>followers</span>
            </div>

            <div className='following flex'>
              <h3>185</h3>
              <span>following</span>
            </div>
          </div>

          <div className='bottom'>
            <h2 className='name'>Deepanshu Tiwari</h2>
            <span>keeps it real.</span>
          </div>
        </div>
      </div>

      <nav>
        <div className='posts'>
          <GridOnOutlinedIcon className='ic_posts' />
          <span>POSTS</span>
        </div>

        <div className='posts'>
          <BookmarkBorderOutlinedIcon className='ic_saved' />
          <span>SAVED</span>
        </div>
      </nav>
    </Wrapper>
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

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .dp:hover {
      cursor: pointer;
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

          span {
            margin-left: 6px;
            color: #444;
            font-size: 0.92em;
          }
        }

        .followers {
          margin: 0 40px;
        }
      }

      .bottom {
        h2 {
          font-size: 1em;
          color: #344;
          margin-bottom: 2px;
        }

        span {
          color: #344;
          font-size: 0.95em;
        }
      }
    }
  }
`;

export default Profile;
