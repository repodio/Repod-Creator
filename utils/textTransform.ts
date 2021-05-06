export const clipText = (text, characterCount = 100) =>
  `${text.substr(0, characterCount)} ${
    text.length > characterCount ? "..." : ""
  }`;
