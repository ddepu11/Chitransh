import styled from 'styled-components';

const usePostLogic = () => {
  console.log('usePostLogic');

  return (
    <Wrapper> 
      <h2>usePostLogic</h2>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 5px 5px;
`;

export default usePostLogic;
