import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ForgotPassword = () => {
  const auth = getAuth();
  let navigate = useNavigate();
  let [email, setEmail] = useState("");
  let handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Check your email for reset password");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        const errorCode = error.code;
        toast.error(errorCode);
      });
  };
  return (
    <div className="bg-primary w-full h-screen flex justify-center items-center">
      <ToastContainer position="bottom-center" theme="dark" />
      <div className="bg-white p-5 rounded w-96">
        <h3 className="font-nunito font-bold text-4xl text-heading ">
          Forgot Password
        </h3>
        <div className="relative mt-8">
          <input
            type="email"
            className="border border-solid border-secondary w-full py-6 px-14 rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="font-nunito font-semibold text-sm text-heading absolute top-[-10px] left-[34px] bg-white px-[18px]">
            Email Address
          </p>
          <button
            onClick={handleForgotPassword}
            className="bg-primary rounded font-nunito font-semibold text-xl text-white p-5 mt-5"
          >
            Update
          </button>
          <button className="bg-primary rounded font-nunito font-semibold text-xl text-white p-5 mt-5 ml-5">
            <Link to="/login">Back to Login</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
