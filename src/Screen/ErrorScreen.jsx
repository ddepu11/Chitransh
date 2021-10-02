import styled from 'styled-components';

const ErrorScreen = () => (
  <Wrapper className='w-960 flex'>
    <h2>Error 404! Sorry the page you have requested doesn&apos;t exists! </h2>
  </Wrapper>
);

const Wrapper = styled.main`
  height: 80vh;
  margin-top: 20px;

  h2 {
    color: #6b6b6b;
    letter-spacing: 1px;
  }
`;

export default ErrorScreen;
