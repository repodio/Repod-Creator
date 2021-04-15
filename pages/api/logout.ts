import { unsetAuthCookies } from "next-firebase-auth";
import initAuth from "firebase/initAuth";

initAuth();

const handler = async (req, res) => {
  try {
    console.log("Logout Handler called");
    await unsetAuthCookies(req, res);
  } catch (e) {
    return res.status(500).json({ error: "Unexpected error." });
  }
  return res.status(200).json({ success: true });
};

export default handler;
