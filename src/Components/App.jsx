import { useState } from "react";
import styled from "styled-components";

const App = () => {
  const [num, setNum] = useState(1);

  const handleIncrease = () => {
    setNum((prevState) => {
      return prevState + 1;
    });
  };

  const handleDecrese = () => {
    setNum((prevState) => {
      return prevState - 1;
    });
  };

  return (
    <Wrapper>
      <h2>I am a app</h2>

      <button onClick={handleIncrease}>Increse</button>

      <h2>{num}</h2>

      <button onClick={handleDecrese}>Decrese</button>

      <p>Hey what's is up guys ??</p>
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
