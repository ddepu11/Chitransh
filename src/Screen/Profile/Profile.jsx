import GridOnOutlinedIcon from '@material-ui/icons/GridOnOutlined';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import styled from 'styled-components';
import { Link, Route } from 'react-router-dom';
import Button from '../../Components/Button';
import useProfileLogic from './Logic/useProfileLogic';
import dummyDp from '../../images/dummyDp.png';
import Loader from '../../Components/Loader';
import Saved from '../Saved/Saved';
import Posts from '../Posts/Posts';

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
  } = useProfileLogic();

  if (userLoading) {
    return <Loader />;
  }

  return (
    <>
      {handlingChangeDp && (
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

      <Wrapper className='w-960'>
        <div className='dp_and_details flex'>
          <div className='dp' onClick={openChangeDpDialog}>
            <img
              src={info.dp.fileName === 'dummyDp' ? dummyDp : info.dp.url}
              alt='dp'
            />
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

        <nav className='flex'>
          {/* postsLinkRef, savedLinkRef, */}
          <Link
            to={`/${info.email}/`}
            className='posts  flex'
            ref={postsLinkRef}
          >
            <GridOnOutlinedIcon className='ic_posts' />
            <span>POSTS</span>
          </Link>
          <Link
            to={`/${info.email}/saved/`}
            className='saved  flex'
            ref={savedLinkRef}
          >
            <BookmarkBorderOutlinedIcon className='ic_saved' />
            <span>SAVED</span>
          </Link>
        </nav>

        {/*  */}
        <Route path='/:userName/' exact>
          <Posts />
        </Route>

        <Route path='/:userName/saved/' exact>
          <Saved />
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
      }
    }

    .dp:hover {
      cursor: pointer;
    }
    .dp:hover::after {
      content: 'Change profile photo';
      background-color: #333;
      color: #f3f0f0;
      font-size: 0.8em;
      padding: 4px 5px;
      border-radius: 5px;
      position: absolute;
      top: 20px;
      right: 00px;
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
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: grid;
  place-content: center;
  z-index: 9;

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

export default Profile;
