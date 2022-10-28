import React, { useState } from "react";
import { RiEyeFill, RiEyeCloseFill } from "react-icons/ri";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { BallTriangle } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../slices/userSlice";

const Login = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  let [emailerr, setEmailerr] = useState("");
  let [passworderr, setPassworderr] = useState("");
  let [passwordShow, setPasswordshow] = useState(false);
  let [success, setSuccess] = useState(false);
  let [loading, setLoading] = useState(false);

  let handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailerr("");
  };

  let handlePassword = (e) => {
    setPassword(e.target.value);
    setPassworderr("");
  };

  let handleSubmit = () => {
    if (!email) {
      setEmailerr("Email is required");
    } else {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
        setEmailerr("Invalid email");
      }
    }

    if (!password) {
      setPassworderr("Password is required");
    }

    if (
      email &&
      password &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)
    ) {
      setLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
          setLoading(false);
          toast.success("Login Successfull. Wait for redirection");
          dispatch(userLoginInfo(user.user));
          localStorage.setItem("userInfo", JSON.stringify(user));
          setTimeout(() => {
            navigate("/");
          }, 2000);
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode.includes("auth/user-not-found")) {
            setEmailerr("Email not found");
          }
          if (errorCode.includes("auth/wrong-password")) {
            setPassworderr("Password not match");
          }

          setLoading(false);
        });
    }
  };

  let handleGoogleSignIn = () => {
    signInWithPopup(auth, provider).then(() => {
      navigate("/");
    });
  };
  return (
    <div className="flex">
      <ToastContainer position="bottom-center" theme="dark" />
      <div className="w-2/4 flex justify-end">
        <div className="mr-16 mt-40">
          <h3 className="font-nunito font-bold text-4xl text-heading">
            Login to your account!
          </h3>
          <p className="font-nunito font-regular text-xl text-secondary mt-3.5">
            <img onClick={handleGoogleSignIn} src="images/google.png" />
          </p>

          {success && (
            <p className="font-nunito font-semibold text-2xl bg-green-500 w-96 rounded-sm mt-2.5 p-1.5 text-white">
              {success}
            </p>
          )}

          <div className="relative mt-16 w-96">
            <input
              type="email"
              className="border-b border-solid border-secondary w-96 py-6 outline-0"
              onChange={handleEmail}
              value={email}
            />
            <p className="font-nunito font-semibold text-sm text-heading absolute top-[-10px] left-0 bg-white">
              Email Address
            </p>

            {emailerr && (
              <p className="font-nunito font-semibold text-sm bg-red-500 w-96 rounded-sm mt-2.5 p-1.5 text-white">
                {emailerr}
              </p>
            )}
          </div>

          <div className="relative mt-16 w-96">
            <input
              type={passwordShow ? "text" : "password"}
              className="border-b border-solid border-secondary w-96 py-6 outline-0"
              onChange={handlePassword}
              value={password}
            />
            {passwordShow ? (
              <RiEyeFill
                onClick={() => setPasswordshow(!passwordShow)}
                className="absolute top-7 right-5"
              />
            ) : (
              <RiEyeCloseFill
                onClick={() => setPasswordshow(!passwordShow)}
                className="absolute top-7 right-5"
              />
            )}
            <p className="font-nunito font-semibold text-sm text-heading absolute top-[-10px] left-0 bg-white">
              Password
            </p>
            {passworderr && (
              <p className="font-nunito font-semibold text-sm bg-red-500 w-96 rounded-sm mt-2.5 p-1.5 text-white">
                {passworderr}
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center w-96">
              <BallTriangle
                height={100}
                width={100}
                radius={5}
                color="#5F35F5"
                ariaLabel="ball-triangle-loading"
                wrapperClass={{}}
                wrapperStyle=""
                visible={true}
              />
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              className="w-96 bg-primary rounded font-nunito font-semibold text-xl text-white py-5 mt-16"
            >
              Login to Continue
            </button>
          )}

          <p className="text-left font-open w-96 font-regular text-sm text-heading mt-9">
            Already have an account ?{" "}
            <Link to="/registration" className="font-bold text-[#EA6C00]">
              Sign Up
            </Link>
          </p>
          <p className="text-center font-open w-96 font-regular text-sm text-heading mt-9">
            <Link to="/forgotpassword" className="font-bold text-[#EA6C00]">
              Forgot Password
            </Link>
          </p>
        </div>
      </div>
      <div className="w-2/4">
        <img className="w-full h-screen object-cover" src="images/login.png" />
      </div>
    </div>
  );
};

export default Login;
