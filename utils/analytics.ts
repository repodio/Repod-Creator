import amplitude from "amplitude-js";
const AMPLITUDE_API_KEY = process.env.AMPLITUDE_API_KEY;

const analyticsEnabled = () => process.env.NODE_ENV === "development";

const initAnalytics = () => {
  if (analyticsEnabled()) {
    console.log("disabling analytics");
    return;
  }

  amplitude.getInstance().init(AMPLITUDE_API_KEY);
};

const identifyUser = (userId) => {
  if (analyticsEnabled()) {
    return;
  }

  amplitude.getInstance().setUserId(userId);
};

/*
 * List of Analytics Events for Amplitude.logEvent().
 */
const analyticsEvents: {
  [key: string]: string;
} = {
  // Auth
  login_error: "login_error",
  signup_error: "signup_error",

  // Other
  debug: "debug",
};

/**
 * Custom logEvent with additional context data.
 */
const logEvent = (eventName = "unnamed_event", eventProps = {}) => {
  if (analyticsEnabled()) {
    return;
  }
  amplitude.getInstance().logEvent(eventName, eventProps);
};

const analyticsReset = () => {
  if (analyticsEnabled()) {
    return;
  }
  amplitude.getInstance().setUserId(null);
  amplitude.getInstance().regenerateDeviceId();
};

export {
  identifyUser,
  analyticsReset,
  analyticsEvents,
  logEvent,
  initAnalytics,
};
