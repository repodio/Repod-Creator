import { init } from "next-firebase-auth";

console.log(".env.local", {
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT,
  FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
  FIREBASE_WEB_API_KEY: process.env.FIREBASE_WEB_API_KEY,
  COOKIE_SECRET_CURRENT: process.env.COOKIE_SECRET_CURRENT,
  COOKIE_SECRET_PREVIOUS: process.env.COOKIE_SECRET_PREVIOUS,
});

const initAuth = () => {
  init({
    authPageURL: "/auth",
    appPageURL: "/",
    loginAPIEndpoint: "/api/login", // required
    logoutAPIEndpoint: "/api/logout", // required
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        // The private key must not be accesssible on the client side.
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      },
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    },
    firebaseClientInitConfig: {
      apiKey: process.env.FIREBASE_WEB_API_KEY, // required
      authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
    },
    cookies: {
      name: "ExampleAppName", // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: "/",
      sameSite: "strict",
      secure: true, // set this to false in local (non-HTTPS) development
      signed: true,
    },
  });
};

export default initAuth;
