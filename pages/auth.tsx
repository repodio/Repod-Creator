// ./pages/demo
import React from "react";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import { useAuth } from "firebase/useAuth";

const SignIn = () => {
  const AuthUser = useAuthUser();
  console.log("AuthUser", AuthUser);
  const { signIn } = useAuth();
  return (
    <>
      <div>
        <h1>Sign In</h1>
        <div className="flex">
          <label className="block">
            <span className="text-gray-700">Email</span>
            <input
              className="form-input mt-1 block w-full"
              placeholder="Jane Doe"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Password</span>
            <input
              className="form-input mt-1 block w-full"
              placeholder="Jane Doe"
            />
          </label>
        </div>
      </div>
    </>
  );
};

// Note that this is a higher-order function.
export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(SignIn);
