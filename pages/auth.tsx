// ./pages/demo
import React, { useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
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
  "auth/email-already-in-use": "That email is already in use",
  "auth/weak-password": "Password must be at least 6 characters",
};

const SignUp = ({ handleToggleSignupMode, authError, setAuthError }) => {
  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit = async ({ email, password, name }) => {
    const response = await signUp({
      email,
      password,
      name,
    });

    if (response && response.error) {
      const errorMessage =
        AUTH_ERROR_CODES[response.error.code] ||
        "Something went wrong. Try again later";
      setAuthError(errorMessage);
    }
  };

  return (
    <>
      <h1 className="text-3xl mb-4">Sign Up</h1>

      <form className=" w-full" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Display Name"
          registerInput={register("name", { required: true })}
          name="name"
          type="name"
          error={Boolean(errors.name)}
          placeholder="Stephen Dubner"
        />
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
          Sign Up
        </Button.Medium>
      </form>
      <p className="w-full text-center text-sm text-repod-text-primary my-4">
        - OR -
      </p>
      <FacebookLoginButton />
      <TwitterLoginButton />

      <a
        className="cursor-pointer flex w-full text-center no-underline text-md text-repod-text-primary hover:opacity-50 transition mt-2"
        onClick={handleToggleSignupMode}
      >
        Already have an account?{" "}
        <p className="ml-1 text-repod-tint font-bold">Log in</p>
      </a>
    </>
  );
};

const LogIn = ({ handleToggleSignupMode, authError, setAuthError }) => {
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

    if (response.error) {
      const errorMessage =
        AUTH_ERROR_CODES[response.error.code] ||
        "Something went wrong. Try again later";
      setAuthError(errorMessage);
    }
  };

  return (
    <>
      <h1 className="text-3xl mb-4">Log In</h1>

      <form className=" w-full" onSubmit={handleSubmit(onSubmit)}>
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
        className="cursor-pointer flex w-full text-center no-underline text-md text-repod-text-primary hover:opacity-50 transition mt-2"
        onClick={handleToggleSignupMode}
      >
        Don't have an account?{" "}
        <p className="ml-1 text-repod-tint font-bold">Sign Up</p>
      </a>
    </>
  );
};

const Auth = () => {
  const [inSignUpMode, toggleSignUpMode] = useState(true);
  const [authError, setAuthError] = useState(null);

  const handleToggleSignupMode = () => {
    setAuthError(null);
    toggleSignUpMode(!inSignUpMode);
  };
  return (
    <div className="flex flex-row bg-green-500">
      <div className="flex flex-col flex-0 bg-repod-canvas min-w-1/2 items-center">
        <div className="self-start ">
          <RepodLogo />
        </div>

        <div className="flex flex-col h-full w-96 mx-16  items-start mt-24">
          {inSignUpMode ? (
            <SignUp
              handleToggleSignupMode={handleToggleSignupMode}
              authError={authError}
              setAuthError={setAuthError}
            />
          ) : (
            <LogIn
              handleToggleSignupMode={handleToggleSignupMode}
              authError={authError}
              setAuthError={setAuthError}
            />
          )}
        </div>
      </div>
      <div className="bg-blue-500"></div>
    </div>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(Auth);
