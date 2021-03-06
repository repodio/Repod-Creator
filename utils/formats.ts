import moment from "moment";
import { analyticsEvents, logEvent } from "./analytics";

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

export const formatDate = (incomingDate) => {
  try {
    if (!incomingDate) {
      return null;
    }

    const date = incomingDate._seconds
      ? incomingDate._seconds * 1000
      : incomingDate;

    const momentIncoming = moment(date);
    const unixYTD = moment().startOf("year").unix();
    const incomingDateInUnix = momentIncoming.unix();

    if (incomingDateInUnix > unixYTD) {
      return momentIncoming.format("MMM DD, hh:mm A");
    } else {
      return momentIncoming.format("MMM Do ’YY");
    }
  } catch (error) {
    logEvent(analyticsEvents.generic_error, {
      function: "formatDate",
      incomingDate: incomingDate,
      typeOf: typeof incomingDate,
    });
    return "";
  }
};

export const formatIntegers = (num, fixed = 1) => {
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

export const getFirstName = (
  displayName = "",
  shouldFirstLetterBeRaised = false
) => {
  const firstName = displayName.split(" ")[0] || "";
  return shouldFirstLetterBeRaised
    ? capitalizeFirstLetter(firstName)
    : firstName;
};

export const getLastName = (
  displayName = "",
  shouldFirstLetterBeRaised = false
) => {
  const lastName =
    displayName.split(" ").splice(1, displayName.split(" ").length).join(" ") ||
    "";
  return shouldFirstLetterBeRaised ? capitalizeFirstLetter(lastName) : lastName;
};

export const formatDuration = (
  duration,
  includeHours = false,
  longMin = false,
  longSec = false
) => {
  if (!duration) {
    return null;
  }
  if (includeHours) {
    const inDays = Math.floor(
      moment.duration(Number(duration)).asDays()
    ).toFixed(0);

    if (Number(inDays) > 0) {
      const inHours = (
        moment.duration(Number(duration)).asHours() -
        24 * Number(inDays)
      ).toFixed(0);
      return `${inDays}d ${inHours}h`;
    }

    const inHours = Math.floor(
      moment.duration(Number(duration)).asHours()
    ).toFixed(0);

    if (Number(inHours) > 0) {
      const inMinutes = (
        moment.duration(Number(duration)).asMinutes() -
        60 * Number(inHours)
      ).toFixed(0);

      return `${inHours}h ${inMinutes}m`;
    }
  }

  const inMinutes = moment.duration(Number(duration)).asMinutes().toFixed(0);
  if (Number(inMinutes) > 0) {
    if (longMin) {
      return `${inMinutes} min`;
    } else {
      return `${inMinutes}m`;
    }
  }
  const inSeconds = moment.duration(Number(duration)).asSeconds().toFixed(0);
  return longSec ? `${inSeconds} sec` : `${inSeconds}s`;
};

export const formatCurrency = (cents = 0) => {
  try {
    return (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  } catch (error) {
    logEvent(analyticsEvents.generic_error, {
      function: "formatCurrency",
      cents: cents,
      typeOf: typeof cents,
    });
    return "";
  }
};

export const formatMonthsFromToday = (incomingDate: Date): number => {
  try {
    return Math.ceil(moment().diff(moment(incomingDate), "months", true));
  } catch (error) {
    logEvent(analyticsEvents.generic_error, {
      function: "formatMonthsFromToday",
      incomingDate: incomingDate,
      typeOf: typeof incomingDate,
    });
    return 0;
  }
};
