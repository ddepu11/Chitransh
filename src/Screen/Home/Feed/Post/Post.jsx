import styled from 'styled-components';

const Post = () => {
  console.log('Post');

  return (
    <Wrapper>
      <h2>Post</h2>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 5px 5px;
`;

export default Post;
