import styled from 'styled-components';
import UpdateFormField from '../../Components/UpdateFormField';
import useEditAccount from './Logic/useEditAccount';
import Button from '../../Components/Button';

const EditAccount = () => {
  const { userInfo, handleInput, validationMessageTags } = useEditAccount();

  return (
    <Wrapper className='w-960 flex'>
      <div className='row'>
        <UpdateFormField
          type='text'
          wannaEdit={true}
          htmlFor='fullName'
          inputName='fullName'
          inputValue={userInfo.fullName}
          heading='Full name:'
          handleInput={handleInput}
          refObj={validationMessageTags.fullNameVMTag}
        />
      </div>

      <div className='row'>
        <UpdateFormField
          type='text'
          wannaEdit={true}
          htmlFor='userName'
          inputName='userName'
          inputValue={userInfo.userName}
          heading='User name:'
          handleInput={handleInput}
          refObj={validationMessageTags.userNameVMTag}
        />
      </div>

      <div className='row'>
        <UpdateFormField
          type='text'
          wannaEdit={true}
          htmlFor='website'
          inputName='website'
          inputValue={userInfo.website}
          heading='Website:'
          handleInput={handleInput}
          refObj={validationMessageTags.websiteVMTag}
        />
      </div>

      <div className='row gender_row_outer flex'>
        <div className='gender_row_inner flex'>
          <label htmlFor='gender'>Gender:</label>

          <input
            type='text'
            readOnly
            value={userInfo.gender ? userInfo.gender : 'click here to choose'}
          />
        </div>
        <p className='message' />
      </div>

      <div className='row bio_row_outer flex'>
        <div className='bio_inner flex'>
          <label htmlFor='bio'>Bio:</label>

          <textarea
            name='bio'
            id='bio'
            value={userInfo.bio}
            onChange={handleInput}
            rows='6'
          >
            {userInfo.bio}
          </textarea>
        </div>

        <p className='message' />
      </div>

      <div className='row'>
        <UpdateFormField
          type='text'
          wannaEdit={false}
          htmlFor='email'
          inputName='email'
          spanInnerText={userInfo.email}
          heading='Email:'
          handleInput={handleInput}
          refObj={validationMessageTags.emailVMTag}
        />
      </div>

      <div className='row submit_btn flex'>
        <Button
          type='button'
          fs='0.9em'
          padding='5px 10px'
          borderRadius='5px'
          bSh=''
          transform='scale(1)'
          bgColor='#0095f6;'
        >
          Submit
        </Button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: 60px 00px 20px;
  flex-direction: column;
  border: 1px solid #dbdbdb;

  .row {
    width: 50%;
    padding: 1px 0;
  }

  .bio_row_outer,
  .gender_row_outer {
    flex-direction: column;
    padding: 0px 0 30px;
    width: 50%;

    label {
      font-size: 1em;
      color: #616161;
      letter-spacing: 2px;
      font-weight: bold;
    }

    textarea,
    input {
      padding: 10px 0px 10px 5px;
      font-size: 1em;
      border-radius: 2px;
      border: 1px solid #dbdbdb;
      width: 50%;
    }

    .bio_inner,
    .gender_row_inner {
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
    }
  }

  .submit_btn {
    margin-top: 12px;
  }
`;

export default EditAccount;
