import React, { useState } from "react";
import { RiEyeFill, RiEyeCloseFill } from "react-icons/ri";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { BallTriangle } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";

const Registration = () => {
  const db = getDatabase();

  const auth = getAuth();
  let navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [fullname, setFullname] = useState("");
  let [password, setPassword] = useState("");

  let [emailerr, setEmailerr] = useState("");
  let [fullnameerr, setFullnameerr] = useState("");
  let [passworderr, setPassworderr] = useState("");
  let [passwordShow, setPasswordshow] = useState(false);
  let [success, setSuccess] = useState(false);
  let [loading, setLoading] = useState(false);

  let handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailerr("");
  };

  let handleFullName = (e) => {
    setFullname(e.target.value);
    setFullnameerr("");
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

    if (!fullname) {
      setFullnameerr("Full name is required");
    }

    if (!password) {
      setPassworderr("Password is required");
    }

    if (
      email &&
      fullname &&
      password &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)
    ) {
      setLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          updateProfile(auth.currentUser, {
            displayName: fullname,
            photoURL: "images/demoimg.png",
          })
            .then(() => {
              toast.success(
                "Registration Successfull. Please varify your email"
              );
              console.log(user);
              setEmail("");
              setFullname("");
              setPassword("");
              sendEmailVerification(auth.currentUser);
              setLoading(false);
              setTimeout(() => {
                navigate("/login");
              }, 2000);
            })
            .then(() => {
              set(ref(db, "users/" + user.user.uid), {
                username: user.user.displayName,
                email: user.user.email,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          if (error.code.includes("auth/email-already-in-use")) {
            setEmailerr("Email already in use");
            setLoading(false);
          }
        });
    }
  };

  return (
    <div className="md:flex px-2.5 md:px-0">
      <ToastContainer position="bottom-center" theme="dark" />
      <div className="w-full md:w-2/4 md:flex justify-end">
        <div className="md:mr-0 md:ml-8 lg:mr-16 xl:mt-10 xl:mt-40">
          <h3 className="font-nunito text-center md:text-left font-bold text-3xl  lg:text-4xl text-heading">
            Get started with easily register
          </h3>
          <p className="font-nunito font-regular text-xl text-secondary mt-3.5 text-center md:text-left">
            Free register and you can enjoy it
          </p>

          {success && (
            <p className="font-nunito font-semibold text-2xl bg-green-500 w-full lg:w-96 rounded-sm mt-2.5 p-1.5 text-white">
              {success}
            </p>
          )}

          <div className="relative mt-10 md:mt-16 w-full md:w-80 lg:w-96">
            <input
              type="email"
              className="border border-solid border-secondary w-full md:w-80 lg:w-96 py-6 px-14 rounded-lg"
              onChange={handleEmail}
              value={email}
            />
            <p className="font-nunito font-semibold text-sm text-heading absolute top-[-10px] left-[34px] bg-white px-[18px]">
              Email Address
            </p>

            {emailerr && (
              <p className="font-nunito font-semibold text-sm bg-red-500 w-full md:w-80 lg:w-96 rounded-sm mt-2.5 p-1.5 text-white">
                {emailerr}
              </p>
            )}
          </div>
          <div className="relative mt-10 md:mt-16 w-full lg:w-96">
            <input
              type="text"
              className="border border-solid border-secondary w-full md:w-80 lg:w-96 py-6 px-14 rounded-lg"
              onChange={handleFullName}
              value={fullname}
            />
            <p className="font-nunito font-semibold text-sm text-heading absolute top-[-10px] left-[34px] bg-white px-[18px]">
              Full Name
            </p>
            {fullnameerr && (
              <p className="font-nunito font-semibold text-sm bg-red-500 w-full md:w-80 md:w-96 rounded-sm mt-2.5 p-1.5 text-white">
                {fullnameerr}
              </p>
            )}
          </div>
          <div className="relative mt-10 md:mt-16 w-full md:w-80 lg:w-96">
            <input
              type={passwordShow ? "text" : "password"}
              className="border border-solid border-secondary w-full md:w-80 lg:w-96 py-6 px-14 rounded-lg"
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
            <p className="font-nunito font-semibold text-sm text-heading absolute top-[-10px] left-[34px] bg-white px-[18px]">
              Password
            </p>
            {passworderr && (
              <p className="font-nunito font-semibold text-sm bg-red-500 w-full md:w-80 lg:w-96 rounded-sm mt-2.5 p-1.5 text-white">
                {passworderr}
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center w-full md:w-80 lg:w-96">
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
              className="w-full md:w-80 lg:w-96 bg-primary rounded-full font-nunito font-semibold text-xl text-white py-5 mt-10 md:mt-16"
            >
              Sign up
            </button>
          )}

          <p className="text-center font-open w-full md:w-80 lg:w-96 font-regular text-sm text-heading mt-9">
            Already have an account ?{" "}
            <Link to="/login" className="font-bold text-[#EA6C00]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <div className="w-2/4 hidden md:block">
        <img
          className="w-full h-full md:h-screen  object-cover"
          src="images/registration.png"
        />
      </div>
    </div>
  );
};

export default Registration;
