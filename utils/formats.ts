import moment from "moment";

const unixDay = 86400;
const unixYTD = moment().startOf("year").unix();
const hourOfSeconds = 3600;
const tenHoursInSeconds = 36000;

moment.locale("en", {
  calendar: {
    lastDay: "[Yesterday], hh:mm A",
    sameDay: "[Today], hh:mm A",
    nextDay: "[Tomorrow], hh:mm A",
    sameElse: "L",
  },
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "1s",
    ss: "%ss",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1mo",
    MM: "%dmo",
    y: "1y",
    yy: "%dY",
  },
});

export const fromNow = (incomingDate) => {
  if (!incomingDate) {
    return null;
  }
  // Today:                      1d
  // Today - 6 day:              6d
  // Today - 6+ day until EOY:   02 May
  // Any previous year:          02 May 19

  const momentIncoming = moment(incomingDate);
  const momentNow = moment(Date.now());

  if (momentNow.diff(momentIncoming, "days") < 1) {
    return `${momentIncoming.calendar()}`;
  } else {
    return momentIncoming.format("Do MMM, YYYY");
  }
};

export const formatIntegers = (num, fixed = 1) => {
  console.log("num", num, typeof num, num.toPrecision);

  if (num === null) {
    return null;
  } // terminate early
  if (num === 0) {
    return "0";
  }
  if (!num.toPrecision) {
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
