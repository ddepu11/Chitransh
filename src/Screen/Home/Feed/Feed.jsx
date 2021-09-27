import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Loader from '../../../Components/Loader';
import useFeedLogic from './Logic/useFeedLogic';
import Button from '../../../Components/Button';

const Feed = () => {
  const { users, loading } = useFeedLogic();

  if (loading) {
    return <Loader />;
  }

  return (
    <Wrapper>
      <div className='row flex' style={{ marginBottom: '20px' }}>
        <p className='suggestion_p'>Suggestions For You</p>

        {users.length !== 0 && (
          <Link
            to='/explore/people'
            style={{ color: '#262626', fontSize: '0.9em' }}
          >
            See All
          </Link>
        )}
      </div>

      {users.length !== 0 ? (
        <div className='row flex'>
          <div className='far_left flex'>
            <div className='dp'>
              <img src='https://i.pravatar.cc/300' alt='' />
            </div>

            <div className='username'>jhajshash</div>
          </div>

          <Button
            type='button'
            bgColor='transparent'
            bSh=''
            transform='scale(1)'
            color='#0095f6'
          >
            Follow
          </Button>
        </div>
      ) : (
        <h3 className='no_suggestion'>Sorry there are no suggestion</h3>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 10px 5px 10px;
  width: 35%;

  .row {
    justify-content: space-between;

    .suggestion_p {
      color: #8e8e8e;
      font-weight: 700;
      font-size: 0.9em;
    }

    .far_left {
      .dp {
        width: 35px;
        height: 35px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .username {
        margin-left: 10px;
      }
    }
  }

  .no_suggestion {
    color: #868686;
    font-size: 0.8em;
    text-align: center;
    padding: 20px 0;
  }
`;

export default Feed;
