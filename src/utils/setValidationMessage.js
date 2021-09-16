const setValidationMessage = (message, cssClass, setTimeOutId, refObj) => {
  const pTag = refObj.current;

  pTag.innerText = message;
  pTag.classList.remove('remove');
  pTag.classList.add(cssClass);

  const setTimeOut = setTimeout(() => {
    pTag.classList.remove(cssClass);
    pTag.classList.add('remove');
    pTag.innerText = '';
  }, 3000);

  setTimeOutId.current = setTimeOut;
};

export default setValidationMessage;
