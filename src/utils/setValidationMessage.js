const setValidationMessage = (message, cssClass, setTimeOutId, refObj) => {
  const pTag = refObj.current;

  pTag.innerText = message;
  pTag.classList.add(cssClass);
  pTag.classList.remove('remove');

  const setTimeOut = setTimeout(() => {
    pTag.classList.remove(cssClass);
    pTag.classList.add('remove');
  }, 3000);

  setTimeOutId.current = setTimeOut;
};

export default setValidationMessage;
