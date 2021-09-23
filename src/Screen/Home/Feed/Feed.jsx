import styled from 'styled-components';

const Feed = () => {
  console.log('Feed');

  return (
    <Wrapper>
      <h2>Feed</h2>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 5px 5px;
  border: 1px solid #c7c7c7;
  width: 35%;
`;

export default Feed;
