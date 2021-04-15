// ./pages/demo
import React from "react";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import { useAuth } from "firebase/useAuth";
import { useForm } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

const SignIn = () => {
  const AuthUser = useAuthUser();
  console.log("AuthUser", AuthUser);
  // const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit = (data) => console.log(data);

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
              defaultValue="nick17@gmail.com"
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
      </div>
    </>
  );
};

// Note that this is a higher-order function.
export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(SignIn);
