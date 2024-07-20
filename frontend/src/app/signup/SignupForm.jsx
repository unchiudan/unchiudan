"use client"
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { SignUpSchema } from "./formvalidator";
import { useFormik } from "formik";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation"; 



function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showsetPassword, SetshowsetPassword] = useState(false);
  const router = useRouter(); // Initialize router


  const signup = async (userData) => {
    let loadingToast;
    try {
      loadingToast = toast.loading("Creating account...");
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signup`,
        userData,
        { withCredentials: true }
      );
  
      const token = response.data.token;
      document.cookie = `jwt=${token}; max-age=${60 * 60 * 24 * 7}; path=/`;
  
      localStorage.setItem("jwt_token", token);
  
      toast.dismiss(loadingToast);
      toast.success("Sign up successful!");
  
      const redirectUrl = localStorage.getItem("redirectUrl");
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        router.push("/user"); // Use router.push for navigation in Next.js
      }
  
      return response.data;
    } catch (error) {
      console.error("Error signing up:", error);
  
      toast.dismiss(loadingToast);
      toast.error("Sign up failed. Please try again.");
      throw error;
    }
  };
  
  const initialValues = {
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    confirmpassword: "",
    phone: "",
  };


  const {
    errors,
    handleBlur,
    handleSubmit,
    values,
    handleChange,
    isValid,
    touched,
  } = useFormik({
    initialValues,
    validationSchema: SignUpSchema,
    onSubmit: (values, action) => {
      signup({
        firstname: values.firstname,
        lastname: values.lastname,
        password: values.password,
        email: values.email,
        phone: values.phone,
      }).then(() => {
        router.push("/user"); // Redirect to /user on successful signup
      });

      action.resetForm();
    },
  });

  const loginwithGoogle = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth/google/callback`
    );
  };


  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex font-semibold  items-center text-center mt-2 p-1 gap-2">
      <div className="font-bold text-lg">
      Have an account?
      </div>
        <Link href="/login" className="text-[#3856ea] text-[18px] flex">
        Log in now
          <FaArrowLeft className="ml-2 mt-1" />
        </Link>
      </div>
      <button
        onClick={loginwithGoogle}
        className="w-full flex items-center mt-2 rounded-[9px] bg-white border-2 border-black hover:bg-gray-50 py-2 px-4 font-medium text-[#000814] duration-300 transform hover:scale-105 focus:outline-none focus:ring focus:border-[#0F7A9D] relative"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="30"
          height="30"
          viewBox="0 0 48 48"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          ></path>
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          ></path>
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
        </svg>
        Sign Up with Google
      </button>
      <br />
      <p className="text-center">OR</p>
      <form onSubmit={handleSubmit} className="mt-6 flex w-full flex-col">
        <div className="flex gap-x-4">
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] ">
              First Name <sup className="text-[#EF476F]">*</sup>
            </p>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={values.firstname}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="First Name"
              className="w-full rounded-[0.5rem] bg-[#E6E6E6] p-[12px]"
            />
            {errors.firstname && touched.firstname && (
              <p className="font-semibold text-[#b40e0e]">{errors.firstname}</p>
            )}
          </label>
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] ">
              Last Name <sup className="text-[#EF476F]">*</sup>
            </p>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={values.lastname}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Last Name"
              className="w-full rounded-[0.5rem] bg-[#E6E6E6] p-[12px]"
            />
            {errors.lastname && touched.lastname && (
              <p className="font-semibold text-[#b40e0e]">{errors.lastname}</p>
            )}
          </label>
        </div>
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] ">
            Email Address <sup className="text-[#EF476F]">*</sup>
          </p>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your Email"
            className="w-full rounded-[0.5rem] bg-[#E6E6E6] p-[12px]"
          />
          {errors.email && touched.email && (
            <p className="font-semibold text-[#b40e0e]">{errors.email}</p>
          )}
        </label>
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] ">
            Phone Number <sup className="text-[#EF476F]">*</sup>
          </p>
          <input
            type="phone"
            id="phone"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Phone Number"
            className="w-full rounded-[0.5rem] bg-[#E6E6E6] p-[12px]"
          />
          {errors.phone && touched.phone && (
            <p className="font-semibold text-[#b40e0e]">{errors.phone}</p>
          )}
        </label>
        <div className="flex gap-x-4">
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] ">
              Create Password <sup className="text-[#EF476F]">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="off"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Your Password"
              className="w-full rounded-[0.5rem] bg-[#E6E6E6] p-[12px] pr-10"
            />

            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            {errors.password && touched.password && (
              <p className="font-semibold text-[#b40e0e]">{errors.password}</p>
            )}
          </label>
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] ">
              Confirm Password <sup className="text-[#EF476F]">*</sup>
            </p>
            <input
              type={showsetPassword ? "text" : "password"}
              id="confirmpassword"
              autoComplete="off"
              name="confirmpassword"
              value={values.confirmpassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm Your Password"
              className="w-full rounded-[0.5rem] bg-[#E6E6E6] p-[12px] pr-10"
            />
            <span
              onClick={() => SetshowsetPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showsetPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>

            {errors.confirmpassword && touched.confirmpassword && (
              <p className="font-semibold text-[#b40e0e]">
                {errors.confirmpassword}
              </p>
            )}
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-[#FFD60A] py-[8px] px-[12px] font-medium text-[#000814] duration-500 hover:scale-[1.1]"
          disabled={!isValid}
        >
          {isValid ? "SignUp" : "❌SignUp"}
        </button>
        <Link
        href="/login"
        className="mt-3 text-center rounded-[8px] bg-[#FFD60A] py-[9px] px-[12px] font-medium text-[#000814] duration-500 hover:scale-[1.1]"
        >
        <button
          type="submit"
        >
          Login
        </button>
        </Link>
      </form>
    </div>
  );
}

export default SignupForm;
