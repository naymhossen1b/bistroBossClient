/* eslint-disable react/no-unescaped-entities */
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import toast from "react-hot-toast";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import SocialLogin from "./SocialLogin";

const SignUp = () => {
  const { userCreate, userUpDateProfile } = useAuth();
  const navigate = useNavigate();

  const publicAxios = useAxiosPublic();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    userCreate(data.email, data.password)
      .then(() => {
        userUpDateProfile(data.displayName, data.photoURL);

        const userInfo = { name: data.name, email: data.email };

        /* User Data Post To mongoDB  */
        publicAxios
          .post("/users", userInfo)
          .then((res) => {
            if (res.data.insertedId) {
              toast.success("User created successfully");
              reset();
              navigate("/");
            }
          })
          .catch((err) => {
            toast.error(err.message);
          });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Login Failed");
      });
  };

  return (
    <div className="hero  bg-base-200">
      <div className="card py-8">
        <div className="card  w-full  shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                {...register("name", { required: true })}
                placeholder="name"
                className="input input-bordered"
              />
              {errors.name && <span className="text-red-600">Name is required</span>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Photo URL</span>
              </label>
              <input
                type="text"
                {...register("photoURL", { required: true })}
                placeholder="Photo URL"
                className="input input-bordered"
              />
              {errors.photoURL && <span className="text-red-600">Photo URL is required</span>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                {...register("email", { required: true })}
                placeholder="email"
                className="input input-bordered"
              />
              {errors.email && <span className="text-red-600">Email is required</span>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                {...register("password", {
                  required: true,
                  minLength: 6,
                  maxLength: 20,
                  pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/,
                })}
                placeholder="password"
                className="input input-bordered"
              />
              {errors.password?.type === "required" && (
                <p className="text-red-600">Password is required</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-red-600">Password must be 6 characters</p>
              )}
              {errors.password?.type === "maxLength" && (
                <p className="text-red-600">Password must be less than 20 characters</p>
              )}
              {errors.password?.type === "pattern" && (
                <p className="text-red-600">
                  Password must have one Uppercase one lower case, one number and one special
                  character.
                </p>
              )}
            </div>
            <div className="form-control">
              <input className=" btn btn-outline btn-warning" type="submit" value="SignUp" />
            </div>
            <div className="my-3">
              <small>Allrady Have An account</small>
              <Link to="/login" className="text-center font-bold text-red-400 underline">
                Login Now
              </Link>
            </div>
            <div className="divider divider-neutral">or</div>
            <div className="flex justify-center">
              <SocialLogin />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
