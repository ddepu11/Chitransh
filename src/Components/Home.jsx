import styled from 'styled-components';

const Home = () => {
  console.log('asljasj');

  return (
    <Wrapper>
      <h2>Home</h2>
      <p>Just Sy</p>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 20px 50px;
  color: #f0f0f0;
  background-color: #555;
`;

export default Home;
