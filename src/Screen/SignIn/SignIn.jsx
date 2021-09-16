import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
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
            width='57%'
            margin='20px 0 0'
            bgColor='#266faa'
          >
            Log In
          </Button>

          <div className='or_line flex'>
            <div className='left_line' />
            <span>OR</span>
            <div className='right_line' />
          </div>

          {/* FcGoogle */}
          <Button
            type='submit'
            padding='5px 10px'
            borderRadius='5px'
            fs='0.8em'
            width='57%'
            margin='20px 0 0'
            bgColor='transparent'
            transform='scale(1.05)'
            bSh='rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
          >
            <div className='center flex'>
              <FcGoogle fontSize='1.5em' />
              <span>Log in with Google</span>
            </div>
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
    padding: 50px 00px 20px;
    width: 50%;
    flex-direction: column;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

    form {
      margin-top: 40px;
      flex-direction: column;
    }

    .row {
      width: 60%;
    }

    .or_line {
      margin-top: 20px;
      width: 57%;
      justify-content: space-between;

      .left_line {
        height: 2px;
        width: 40%;
        background-color: #c5c5c5;
      }

      span {
        color: #686565;
      }

      .right_line {
        height: 2px;
        width: 40%;
        background-color: #c5c5c5;
      }

      :hover {
        cursor: default;
      }
    }

    .center {
      color: #333;

      span {
        margin-left: 10px;
        font-size: 1.3em;
      }
    }
  }
`;

export default SignIn;
