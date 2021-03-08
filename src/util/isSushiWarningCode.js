const isSushiWarningCode = code => {
  const val = parseInt(code, 10);
  return val >= 1 && val <= 999;
};

export default isSushiWarningCode;
