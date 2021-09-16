const clearAllSetTimeoutOrSetInterval = (setTimeOutId) => {
  let ids = setTimeOutId.current;

  while (ids > 0) {
    clearTimeout(ids);
    ids -= ids;
  }
};

export default clearAllSetTimeoutOrSetInterval;
