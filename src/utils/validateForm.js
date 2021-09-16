import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import setValidationMessage from './setValidationMessage';

const validateForm = (
  credentials,
  validationMessageTags,
  setTimeOutId,
  validateFor
) => {
  let errorFlag = false;

  const { email, password, fullName, userName } = credentials;
  const {
    emailValidationMessageTag,
    passwordValidationMessageTag,
    fullNameValidationMessageTag,
    userNameValidationMessageTag,
  } = validationMessageTags;

  // Email Validation
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

  if (validateFor === 'SIGN_UP') {
    // fullName validation
    if (isLength(fullName, 0, 2)) {
      setValidationMessage(
        'full name is too short!',
        'error',
        setTimeOutId,
        fullNameValidationMessageTag
      );
      errorFlag = true;
    }

    if (!isLength(fullName, 0, 20)) {
      setValidationMessage(
        'full name is too lengthy!',
        'error',
        setTimeOutId,
        fullNameValidationMessageTag
      );
      errorFlag = true;
    }

    if (isEmpty(fullName)) {
      setValidationMessage(
        "full name can't be empty!",
        'error',
        setTimeOutId,
        fullNameValidationMessageTag
      );
      errorFlag = true;
    }

    // userName validation
    if (isLength(userName, 0, 4)) {
      setValidationMessage(
        'user name is too short!',
        'error',
        setTimeOutId,
        userNameValidationMessageTag
      );
      errorFlag = true;
    }

    if (!isLength(userName, 0, 15)) {
      setValidationMessage(
        'user name is too lengthy!',
        'error',
        setTimeOutId,
        userNameValidationMessageTag
      );
      errorFlag = true;
    }

    if (isEmpty(userName)) {
      setValidationMessage(
        "user name can't be empty!",
        'error',
        setTimeOutId,
        userNameValidationMessageTag
      );
      errorFlag = true;
    }

    // Password validation
    if (!isLength(password, 0, 20)) {
      setValidationMessage(
        'password is too lengthy!',
        'error',
        setTimeOutId,
        passwordValidationMessageTag
      );
      errorFlag = true;
    }
  }

  // Password validation
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
