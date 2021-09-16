import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import setValidationMessage from './setValidationMessage';

const validateForm = (credentials, validationMessageTags, setTimeOutId) => {
  let errorFlag = false;

  const { email, password } = credentials;
  const { emailValidationMessageTag, passwordValidationMessageTag } =
    validationMessageTags;

  if (!isEmail(email)) {
    setValidationMessage(
      'invaild email address!',
      'error',
      setTimeOutId,
      emailValidationMessageTag
    );
    errorFlag = true;
  }

  if (isEmpty(email)) {
    setValidationMessage(
      "email can't be empty!",
      'error',
      setTimeOutId,
      emailValidationMessageTag
    );
    errorFlag = true;
  }

  if (isLength(password, 0, 2)) {
    setValidationMessage(
      'password is too short!',
      'error',
      setTimeOutId,
      passwordValidationMessageTag
    );
    errorFlag = true;
  }

  if (isEmpty(password)) {
    setValidationMessage(
      "password can't be empty!",
      'error',
      setTimeOutId,
      passwordValidationMessageTag
    );
    errorFlag = true;
  }

  return errorFlag;
};

export default validateForm;
