import styled from 'styled-components';
import { Link } from 'react-router-dom';
import TwitterIcon from '@material-ui/icons/Twitter';
import FormControl from '../../Components/FormControl';
import Button from '../../Components/Button';
import useLogInLogic from './Logic/useLogInLogic';

const LogIn = () => {
  const {
    handleSubmit,
    handleInput,
    userCredentials,
    handleLoginViaTwitter,
    emailValidationMessageTag,
    passwordValidationMessageTag,
  } = useLogInLogic();

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
              inputType='text'
              labelFs='1em'
              inputFs='1em'
              inputPadding='8px 10px'
              inputColor='#333'
              inputValue={userCredentials.email}
              handleInput={handleInput}
              refObj={emailValidationMessageTag}
              messageFs='0.8em'
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
              labelFs='1em'
              inputFs='1em'
              inputPadding='8px 10px'
              inputColor='#333'
              inputValue={userCredentials.password}
              handleInput={handleInput}
              refObj={passwordValidationMessageTag}
              messageFs='0.8em'
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
            transform='scale(1.02)'
          >
            Log In
          </Button>

          <div className='or_line flex'>
            <div className='left_line' />
            <span>OR</span>
            <div className='right_line' />
          </div>

          <Button
            type='button'
            padding='5px 10px'
            borderRadius='5px'
            fs='1.1em'
            width='57%'
            margin='20px 0 0'
            bgColor='transparent'
            transform='scale(1.03)'
            bSh='rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
            handleClick={handleLoginViaTwitter}
          >
            <div className='center flex'>
              <TwitterIcon className='ic_twitter' />
              <span>Log in with twitter</span>
            </div>
          </Button>
        </form>
      </div>

      <div className='bottom flex'>
        <p>Don&apos;t have an account?</p>

        <Link to='/signup'>
          <Button
            type='submit'
            padding='5px 10px'
            borderRadius='5px'
            margin='0px 0 0'
            bgColor='transparent'
            bSh=''
            color='#147cd1'
            fs='0.9em'
            transform=''
          >
            <span style={{ fontWeight: 700 }}>Sign Up</span>
          </Button>
        </Link>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 50px 0;
  flex-direction: column;

  .instagram {
    font-family: 'Cookie', cursive;
    text-align: center;
    font-size: 3.3em;
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
      .ic_twitter {
        color: #0d97e7;
      }

      span {
        color: #333;
        margin-left: 10px;
      }
    }
  }

  .bottom {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    width: 50%;
    padding: 10px 0;
    margin-top: 10px;

    p {
      font-size: 0.9em;
    }

    p:hover {
      cursor: default;
    }
  }
`;

export default LogIn;
