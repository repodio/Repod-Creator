export const formatIntegers = (num, fixed = 1) => {
  if (num === null) {
    return null;
  } // terminate early
  if (num === 0) {
    return "0";
  } // terminate early
  fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
  var b = num.toPrecision(2).split("e"), // get power
    k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
    c =
      k < 1
        ? num.toFixed(0 + fixed)
        : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
    d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
    e = d + ["", "K", "M", "B", "T"][k]; // append power
  return e;
};

const capitalizeFirstLetter = (string = "") => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/*
 * @params displayName: full name
 */
export const getFirstName = (
  displayName = "",
  shouldFirstLetterBeRaised = false
) => {
  const firstName = displayName.split(" ")[0] || "";
  return shouldFirstLetterBeRaised
    ? capitalizeFirstLetter(firstName)
    : firstName;
};

/*
 * @params displayName: full name
 */
export const getLastName = (
  displayName = "",
  shouldFirstLetterBeRaised = false
) => {
  const lastName =
    displayName.split(" ").splice(1, displayName.split(" ").length).join(" ") ||
    "";
  return shouldFirstLetterBeRaised ? capitalizeFirstLetter(lastName) : lastName;
};
