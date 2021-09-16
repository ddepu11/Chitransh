import { useState } from 'react';
import styled from 'styled-components';
import Home from './Home';

const App = () => {
  const [num, setNum] = useState(1);

  const handleIncrease = () => {
    setNum((prevState) => prevState + 1);
  };

  const handleDecrese = () => {
    setNum((prevState) => prevState - 1);
  };

  return (
    <Wrapper>
      <Home />
      <p>Hello world</p>
      <h2>I am a not just a app</h2>

      <button type='button' onClick={handleIncrease}>
        Increse
      </button>

      <h2>{num}</h2>

      <button type='button' onClick={handleDecrese}>
        Decrese
      </button>

      <p>Hey whats is up guys ??</p>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 20px 50px;

  background-color: #222;
  color: #aaa;

  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1.2em;
  }
`;

export default App;
