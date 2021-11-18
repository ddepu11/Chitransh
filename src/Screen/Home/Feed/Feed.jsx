import PropTypes from 'prop-types';
import styled from 'styled-components';
import useFeedLogic from './Logic/useFeedLogic';
import CircleLoader from '../../../Components/CircleLoader';
import SuggestedUser from './SuggestedUser';

const Feed = ({ info, id }) => {
  const { users, loading, followAPerson, followLoading } = useFeedLogic(
    info,
    id
  );

  if (loading) {
    return (
      <CircleLoader
        cirH='50px'
        cirW='50px'
        wrapperMargin='0 auto'
        wrapperH='400px'
      />
    );
  }

  return (
    <Wrapper>
      <div className='row flex' style={{ marginBottom: '20px' }}>
        <p className='suggestion_p'>Suggestions For You</p>
        {/* 
        {users.length !== 0 && (
          <Link
            to='/explore/people'
            style={{ color: '#262626', fontSize: '0.9em' }}
          >
            See All
          </Link>
        )} */}
      </div>

      {users.length !== 0 ? (
        users.map((item) => (
          <SuggestedUser
            key={item.id}
            item={item}
            followLoading={followLoading}
            followAPerson={followAPerson}
            id={id}
            info={info}
          />
        ))
      ) : (
        <h3 className='no_suggestion'>Sorry there are no suggestion</h3>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 10px 0px 10px;
  width: 35%;
  height: 660px;
  overflow-y: scroll;

  .row {
    justify-content: space-between;
    margin-bottom: 18px;

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
          object-fit: cover;
        }
      }

      .username {
        margin-left: 10px;
        font-size: 0.87em;
        font-weight: 700;
        color: #3b3b3b;
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

Feed.propTypes = {
  info: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default Feed;
