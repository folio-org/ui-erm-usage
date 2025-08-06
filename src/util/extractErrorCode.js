const extractErrorCode = (input) => {
  const counter4Regex = /Number=(\d{1,4})/;
  const counter5Regex = /"Code"\s*:\s*(\d{1,4})/;

  const codeMatch = input.match(counter4Regex) || input.match(counter5Regex);

  if (codeMatch) {
    return {
      code: codeMatch[1],
    };
  }

  return null;
};

export default extractErrorCode;
