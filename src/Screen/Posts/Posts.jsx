import styled from 'styled-components';
import PropTypes from 'prop-types';

const Posts = ({ posts }) => {
  console.log('Posts');

  console.log(posts);
  return (
    <Wrapper>
      <h2>Posts</h2>
      {/* <h3>{post.length}</h3> */}
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 5px 5px;
`;

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default Posts;
