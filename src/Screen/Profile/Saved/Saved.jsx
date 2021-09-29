import styled from 'styled-components';
import PropTypes from 'prop-types';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestoreInstance } from '../../../config/firebase';
import UserPosts from '../../Posts/UserPosts';

const Saved = ({ info }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      info.savedPostsIds.forEach(async (savedPostId, index) => {
        const newPosts = [];

        const q = query(
          collection(firestoreInstance, 'posts'),
          where('id', '==', savedPostId)
        );

        const postsSnap = await getDocs(q);

        postsSnap.forEach((p) => {
          newPosts.push(p.data());
        });

        if (info.savedPostsIds.length - 1 === index) {
          setLoading(false);
          setSavedPosts(newPosts);
          console.log(newPosts);
        } else {
          setLoading(false);
        }
      });
    };

    if (savedPosts.length === 0 && info.savedPostsIds.length !== 0) {
      getPosts();
    } else {
      setLoading(false);
    }
  }, [info, savedPosts]);

  return (
    <Wrapper>
      <UserPosts posts={savedPosts} loading={loading} savedPosts={true} />
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 5px 5px;
`;

Saved.propTypes = {
  info: PropTypes.object.isRequired,
};

export default Saved;
