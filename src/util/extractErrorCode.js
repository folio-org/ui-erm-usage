const extractErrorCode = (input) => {
  const codeRegex = /(?:Number=|"Code"\s*:\s*)(\d{1,4})/;
  const messageRegex = /"Message"\s*:\s*"([^"]+)"/;

  const codeMatch = input.match(codeRegex);
  const messageMatch = input.match(messageRegex);

  if (codeMatch) {
    return {
      code: codeMatch[1],
      message: messageMatch?.[1] ?? null,
    };
  }

  return null;
};

export default extractErrorCode;
