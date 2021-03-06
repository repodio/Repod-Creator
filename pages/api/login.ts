import { setAuthCookies } from "next-firebase-auth";
import { initAuth } from "firebaseHelpers/init";

initAuth();

const handler = async (req, res) => {
  try {
    console.log("Login Handler called", typeof window);
    await setAuthCookies(req, res);
  } catch (e) {
    return res.status(500).json({ error: "Unexpected error." });
  }
  return res.status(200).json({ success: true });
};

export default handler;
