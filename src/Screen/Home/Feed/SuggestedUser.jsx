import { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useDispatch } from 'react-redux';

import Button from '../../../Components/Button';
import dummyDp from '../../../images/dummyDp.png';
import CircleLoader from '../../../Components/CircleLoader';
import { firestoreInstance } from '../../../config/firebase';
import useNotificationOperations from '../../../Components/useNotificationOperations';
import useUserOperation from '../../../Components/useUserOperations';
import {
  notificationShowError,
  notificationShowInfo,
} from '../../../features/notification';

const SuggestedUser = ({ item, id, info }) => {
  const dispatch = useDispatch();
  const [followLoading, setFollowLoading] = useState(false);

  const { getUpdatedUserDoc } = useUserOperation();
  const { sendNotification } = useNotificationOperations();

  const followAPerson = async (e) => {
    setFollowLoading(true);

    const personDocId = e.target.getAttribute('data-value');

    try {
      // Adding my id in person's followers array whom you  gonna follow
      await updateDoc(doc(firestoreInstance, 'users', personDocId), {
        followers: arrayUnion(id),
      });

      // Add person's id whom you gonna follow, in logged in user's following array
      const userRef = doc(firestoreInstance, 'users', id);

      await updateDoc(userRef, {
        following: arrayUnion(personDocId),
      });

      // Send notification
      const notification = {
        body: `has started following you`,
        sendToUserId: personDocId,
        whoMade: {
          userName: info.userName,
          userId: id,
          userDpUrl: info.dp.url,
        },
        postId: null,
        postImg: '',
        createdOn: Date.now(),
      };

      await sendNotification(personDocId, notification);

      await getUpdatedUserDoc(id);

      setFollowLoading(false);

      dispatch(
        notificationShowInfo({ msg: 'Successfully followed a person!' })
      );
    } catch (err) {
      dispatch(notificationShowError({ msg: err.code.toString().slice(5) }));

      setFollowLoading(true);
    }
  };

  return (
    <Wrapper className='row flex' key={item.id}>
      <div className='far_left flex'>
        <div className='dp'>
          <img src={item.dp.url === '' ? dummyDp : item.dp.url} alt='' />
        </div>

        <Link to={`/profile/${item.userDocId}/`} className='username'>
          {item.userName}
        </Link>
      </div>

      {followLoading ? (
        <CircleLoader wrapperMargin='0px 15px 10px 12px' />
      ) : (
        <Button
          type='button'
          bgColor='transparent'
          bSh=''
          transform='scale(1)'
          color='#0095f6'
          fs='0.87em'
          fWeight='700'
          handleClick={followAPerson}
          dataVal={item.userDocId}
        >
          Follow
        </Button>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.main``;

SuggestedUser.propTypes = {
  item: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  info: PropTypes.object.isRequired,
};

export default SuggestedUser;
