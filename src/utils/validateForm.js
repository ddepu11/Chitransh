import isEmpty from 'validator/lib/isEmpty';
import setValidationMessage from './setValidationMessage';

const validateForm = (credentials, validationMessageTags, setTimeOutId) => {
  let errorFlag = false;

  const { email, password } = credentials;
  const { emailValidationMessageTag, passwordValidationMessageTag } =
    validationMessageTags;

  if (isEmpty(email)) {
    setValidationMessage(
      "email can't be empty!",
      'error',
      setTimeOutId,
      emailValidationMessageTag
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
