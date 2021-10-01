import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import UpdateFormField from '../../Components/UpdateFormField';
import useEditAccount from './Logic/useEditAccount';
import Button from '../../Components/Button';
import Loader from '../../Components/Loader';

const EditAccount = () => {
  const {
    userInfo,
    handleInput,
    validationMessageTags,
    handlingChangeGender,
    closeDialogBox,
    handleGender,
    openDialogBox,
    changeGender,
    gender,
    userLoading,
    handleUpdateInfo,
  } = useEditAccount();

  let newGender = gender;

  if (newGender === 'no_to_say') {
    newGender = 'Gender';
  }

  if (userLoading) {
    return <Loader />;
  }

  return (
    <>
      {handlingChangeGender && (
        <ChangeGenderDialog>
          <div className='center_box flex'>
            <h2 className='heading'>Gender</h2>
            <CloseIcon className='close_dialog' onClick={closeDialogBox} />

            <div className='genders flex'>
              <div className='male flex'>
                <input
                  type='radio'
                  id='male'
                  name='gender'
                  onChange={handleGender}
                  checked={gender === 'male' && true}
                />
                <label htmlFor='male'>Male</label>
              </div>

              <div className='female flex'>
                <input
                  type='radio'
                  id='female'
                  name='gender'
                  onChange={handleGender}
                  checked={gender === 'female' && true}
                />
                <label htmlFor='female'>Female</label>
              </div>

              <div className='not_to_say flex'>
                <input
                  type='radio'
                  id='no_to_say'
                  onChange={handleGender}
                  name='gender'
                  checked={gender === 'no_to_say' && true}
                />
                <label htmlFor='no_to_say'>Prefer Not To Say</label>
              </div>
            </div>

            <div className='done_btn'>
              <Button
                type='button'
                bgColor='#0095f6'
                width='100%'
                padding='8px 00px'
                bSh=''
                transform='scale(1)'
                borderRadius='5px'
                handleClick={changeGender}
              >
                Done
              </Button>
            </div>
          </div>
        </ChangeGenderDialog>
      )}

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

        <div className='row'>
          <UpdateFormField
            type='tel'
            wannaEdit={true}
            htmlFor='phoneNumber'
            inputName='phoneNumber'
            inputValue={userInfo.phoneNumber}
            heading='Phone number:'
            handleInput={handleInput}
            refObj={validationMessageTags.phoneNumberVMTag}
          />
        </div>

        <div className='row gender_row_outer flex'>
          <div className='gender_row_inner flex'>
            <label htmlFor='gender' onClick={openDialogBox}>
              Gender:
            </label>

            <input
              type='text'
              readOnly
              value={newGender !== '' ? newGender : 'click here to choose'}
              onClick={openDialogBox}
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
            bgColor='#0095f6'
            handleClick={handleUpdateInfo}
          >
            Submit
          </Button>
        </div>
      </Wrapper>
    </>
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

const ChangeGenderDialog = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: grid;
  place-content: center;
  z-index: 13;

  .center_box {
    width: 30vw;
    height: auto;
    background-color: #fbfbfb;
    border-radius: 12px;
    flex-direction: column;
    justify-content: flex-start;
    color: #333;
    font-size: 0.95em;
    position: relative;
  }

  .close_dialog {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 1.8em;
  }

  .close_dialog:hover {
    cursor: pointer;
  }

  .heading {
    width: 100%;
    font-size: 1.05em;
    padding: 12px 0;
    border-bottom: 1px solid #cac9c9;
    text-align: center;
  }

  .genders {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 0px 20px 20px;
    /* justify-content: flex-start; */

    .male {
      margin-bottom: 4px;
    }

    .female {
      margin-bottom: 4px;
    }

    .not_to_say {
    }

    label {
      font-weight: 700;
      margin-left: 10px;
      color: #444343;
    }
  }

  .done_btn {
    width: 100%;
    padding: 15px 15px;
  }
`;

export default EditAccount;
