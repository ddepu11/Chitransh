import styled from 'styled-components';
import FormControl from '../../Components/FormControl';

const SignIn = () => {
  console.log('SignIn');

  return (
    <Wrapper className='flex'>
      <div className='hero'>
        <h1 className='instagram'>Chintransh</h1>

        <form>
          <div className='row'>
            <FormControl
              fcWidth='70%'
              fcPadding='5px'
              label='Email'
              placeholder='enter your email'
              name='email'
              id='email'
              inputType='email'
              labelFs='1.1em'
              inputFs='1em'
            />
          </div>

          <div className='row'>
            <FormControl
              fcWidth='70%'
              fcPadding='5px'
              label='Password'
              placeholder='enter your password'
              name='password'
              id='password'
              inputType='password'
              labelFs='1.1em'
              inputFs='1em'
            />
          </div>
        </form>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  border: 1px dashed #b9b8b8;
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
    width: 50%;
    flex-direction: column;
    border: 1px dashed #6b6a6a;
    padding: 20px 30px;

    form {
      margin-top: 40px;
    }
  }
`;

export default SignIn;
