import { withAuthUser, AuthAction } from "next-firebase-auth";

export async function getServerSideProps(context) {
  const { res } = context;
  res.setHeader("location", "/");
  res.statusCode = 302;
  res.end();
  return {
    props: {},
  };
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(null);
