// ./pages/demo
import React, { useState } from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { useAuth } from "firebaseHelpers/useAuth";
import { useForm } from "react-hook-form";
import { initAuth } from "firebaseHelpers/init";
import { RepodLogo } from "components/Header";
import { FormInput } from "components/Inputs";

import {
  Button,
  FacebookLoginButton,
  TwitterLoginButton,
} from "components/Buttons";

initAuth();

type Inputs = {
  name: string;
  email: string;
  password: string;
};

const AUTH_ERROR_CODES = {
  "auth/user-not-found": "Couldn't find an account by this email/password",
};

const SignIn = () => {
  const [isSignUpMode, toggleSignUpMode] = useState(true);
  const [authError, setAuthError] = useState(null);
  const AuthUser = useAuthUser();
  console.log("SignIn", AuthUser);
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit = async ({ email, password }) => {
    const response = await signIn({
      email,
      password,
    });
    console.log("sign in response", response);
    if (response.error) {
      const errorMessage =
        AUTH_ERROR_CODES[response.error.code] ||
        "Something went wrong. Try again later";
      setAuthError(errorMessage);
    }
  };

  return (
    <div className="flex flex-row bg-green-500">
      <div className="flex flex-col flex-0 bg-repod-canvas min-w-1/2 items-center">
        <div className="self-start ">
          <RepodLogo />
        </div>

        <div className="flex flex-col h-full w-96 mx-16 justify-center items-start">
          <h1 className="text-3xl mb-4">Sign Up</h1>

          <form className=" w-full" onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              label="Display Name"
              registerInput={register("name", { required: true })}
              name="name"
              type="name"
              error={Boolean(errors.name)}
              placeholder="Stephen Dubner"
            />{" "}
            <FormInput
              label="Email"
              registerInput={register("email", { required: true })}
              name="email"
              type="email"
              error={Boolean(errors.email)}
              placeholder="stephen@example.com"
            />
            <FormInput
              label="Password"
              registerInput={register("password", { required: true })}
              name="password"
              type="password"
              error={Boolean(errors.password)}
              placeholder="p@s$w0rd"
            />
            {authError ? <p className="mb-4 text-danger">{authError}</p> : null}
            <Button.Medium
              type="submit"
              className="bg-repod-tint text-repod-text-alternative"
            >
              Log In
            </Button.Medium>
          </form>
          <p className="w-full text-center text-sm text-repod-text-primary my-4">
            - OR -
          </p>
          <FacebookLoginButton />
          <TwitterLoginButton />

          <a
            className="flex w-full text-center no-underline text-md text-repod-text-primary hover:opacity-50 transition mt-2"
            href="/login"
          >
            Already have an account?{" "}
            <p className="ml-1 text-repod-tint font-bold">Log in</p>
          </a>
        </div>
      </div>
      <div className="bg-blue-500"></div>
    </div>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(SignIn);
