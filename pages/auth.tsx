// ./pages/demo
import React from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { useAuth } from "firebaseHelpers/useAuth";
import { useForm } from "react-hook-form";
import { initAuth } from "firebaseHelpers/init";
import LogoutButton from "components/logoutButton";

initAuth();

const TEMP_EMAIL = "nick17@example.com";
const TEMP_PASSWORD = "password";

type Inputs = {
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
    <>
      <div>
        <h1>Sign In</h1>

        <form className="mb-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col mb-4">
            <label
              className="mb-2 uppercase font-bold text-lg text-grey-darkest"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="border py-2 px-3 text-grey-darkest"
              type="email"
              name="email"
              id="email"
              defaultValue={TEMP_EMAIL}
              {...register("email", { required: true })}
            />
            {errors.email && <span>Valid Email is required</span>}
          </div>
          <div className="flex flex-col mb-6">
            <label
              className="mb-2 uppercase font-bold text-lg text-grey-darkest"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="border py-2 px-3 text-grey-darkest"
              type="password"
              name="password"
              id="password"
              defaultValue={TEMP_PASSWORD}
              {...register("password", { required: true })}
            />
            {errors.password && <span>Valid Password is required</span>}
          </div>
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

        <LogoutButton />
      </div>
    </>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(SignIn);
