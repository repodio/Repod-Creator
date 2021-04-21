// ./pages/demo
import React from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { useAuth } from "firebaseHelpers/useAuth";
import { useForm } from "react-hook-form";
import { initAuth } from "firebaseHelpers/init";
import FacebookLoginButton from "components/Buttons/facebookLoginButton";
import TwitterLoginButton from "components/Buttons/twitterLoginButton";
import AppleLoginButton from "components/Buttons/appleLoginButton";
import { RepodLogo } from "components/Header";
import { FormInput } from "components/Inputs";

initAuth();

const TEMP_EMAIL = "nick17@example.com";
const TEMP_PASSWORD = "password";

type Inputs = {
  name: string;
  email: string;
  password: string;
};

const SignIn = () => {
  const AuthUser = useAuthUser();
  console.log("SignIn", AuthUser);
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit = ({ email, password }) => {
    signIn({
      email,
      password,
    });
  };

  return (
    <div className="flex flex-row bg-green-500">
      <div className="flex flex-col flex-0 bg-repod-canvas">
        <RepodLogo />

        <div className="flex flex-col h-full w-96 mx-16 justify-center items-start">
          <h1 className="text-3xl">Sign In</h1>

          <form className="mb-6 w-full" onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              label="Display Name"
              registerInput={register("name", { required: true })}
              name="name"
              type="name"
              error={errors.name}
              placeholder="Stephen Dubner"
            />{" "}
            <FormInput
              label="Email"
              registerInput={register("email", { required: true })}
              defaultValue={TEMP_EMAIL}
              name="email"
              type="email"
              error={errors.email}
              placeholder="stephen@example.com"
            />
            <FormInput
              label="Password"
              registerInput={register("password", { required: true })}
              defaultValue={TEMP_PASSWORD}
              name="password"
              type="password"
              error={errors.password}
              placeholder="p@s$w0rd"
            />
            <button
              className="block bg-teal hover:bg-teal-dark text-white uppercase text-lg mx-auto p-4 rounded"
              type="submit"
            >
              Log In
            </button>
          </form>
          <a
            className="block w-full text-center no-underline text-sm text-grey-dark hover:text-grey-darker"
            href="/login"
          >
            Already have an account?
          </a>

          <FacebookLoginButton />
          <TwitterLoginButton />
          <AppleLoginButton />
        </div>
      </div>
      <div className="bg-blue-500"></div>
    </div>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(SignIn);
