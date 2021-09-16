import styled from 'styled-components';
import FormControl from '../../Components/FormControl';
import Button from '../../Components/Button';
import useSignInLogic from './Login/useSignInLogic';

const SignIn = () => {
  const { handleSubmit, handleInput, userCredentials } = useSignInLogic();

  return (
    <Wrapper className='flex'>
      <div className='hero'>
        <h1 className='instagram'>Chitransh</h1>

        <form className='flex' onSubmit={handleSubmit}>
          <div className='row'>
            <FormControl
              fcWidth='100%'
              fcPadding='5px'
              label='Email'
              placeholder='enter your email'
              name='email'
              id='email'
              inputType='email'
              labelFs='1.1em'
              inputFs='1em'
              inputColor='#333'
              inputValue={userCredentials.email}
              handleInput={handleInput}
            />
          </div>

          <div className='row'>
            <FormControl
              fcWidth='100%'
              fcPadding='5px'
              label='Password'
              placeholder='enter your password'
              name='password'
              id='password'
              inputType='password'
              labelFs='1.1em'
              inputFs='1em'
              inputColor='#333'
              inputValue={userCredentials.password}
              handleInput={handleInput}
            />
          </div>

          <Button
            type='submit'
            padding='5px 10px'
            borderRadius='5px'
            fs='0.8em'
            width='52%'
            margin='20px 0 0'
            bgColor='#266faa'
          >
            Log In
          </Button>
        </form>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 50px 0;

  .instagram {
    font-family: 'Cookie', cursive;
    text-align: center;
    font-size: 3em;
    letter-spacing: 3px;
    color: #233;
  }
  .instagram:hover {
    cursor: default;
  }

  .hero {
    padding: 50px 00px;
    width: 50%;
    flex-direction: column;
    border: 1px dashed #bbbbbb;

    form {
      margin-top: 40px;
      flex-direction: column;
    }

    .row {
      width: 60%;
    }
  }
`;

export default SignIn;
