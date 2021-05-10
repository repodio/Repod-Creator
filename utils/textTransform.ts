export const clipText = (text, characterCount = 100) =>
  `${text.substr(0, characterCount)} ${
    text.length > characterCount ? "..." : ""
  }`;

export const maskEmail = (email) => {
  if (!email) {
    return email;
  }
  let maskedEmail = email.replace(/([^@\.])/g, "*").split("");
  let previous = "";
  for (let i = 0; i < maskedEmail.length; i++) {
    if (i <= 0 || previous == "." || previous == "@") {
      maskedEmail[i] = email[i];
    }
    previous = email[i];
  }
  return maskedEmail.join("");
};
