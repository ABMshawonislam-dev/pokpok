import React from "react";
import { AiOutlineHome, AiFillSetting } from "react-icons/ai";
import { RiMessage2Fill } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../slices/userSlice";
const Sidebar = () => {
  const auth = getAuth();
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let handleLogOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(userLoginInfo(null));
        localStorage.removeItem("userInfo");
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <div className="w-full bg-primary h-screen rounded-3xl p-9">
      <img className="mx-auto " src="images/profile.png" />
      <div className="mt-24 relative z-[1] after:z-[-1] after:bg-white after:w-[135%] after:h-[89px] after:content-[''] after:absolute after:top-[-16px] after:left-0 after:rounded-tl-lg after:rounded-bl-lg before:w-[8px] before:h-[185%] before:bg-primary before:absolute before:top-[-16px] before:right-[-36px] before:content-[''] before:rounded-tl-lg before:rounded-bl-lg">
        <AiOutlineHome className="text-5xl text-[#5F35F5] mx-auto" />
      </div>
      <div className="mt-24 relative z-[1] after:z-[-1] after:bg-none after:w-[135%] after:h-[89px] after:content-[''] after:absolute after:top-[-16px] after:left-0 after:rounded-tl-lg after:rounded-bl-lg before:w-[8px] before:h-[185%] before:bg-none before:absolute before:top-[-16px] before:right-[-36px] before:content-[''] before:rounded-tl-lg before:rounded-bl-lg">
        <RiMessage2Fill className="text-5xl text-[#BAD1FF] mx-auto" />
      </div>
      <div className="mt-24 relative z-[1] after:z-[-1] after:bg-none after:w-[135%] after:h-[89px] after:content-[''] after:absolute after:top-[-16px] after:left-0 after:rounded-tl-lg after:rounded-bl-lg before:w-[8px] before:h-[185%] before:bg-none before:absolute before:top-[-16px] before:right-[-36px] before:content-[''] before:rounded-tl-lg before:rounded-bl-lg">
        <IoMdNotificationsOutline className="text-5xl text-[#BAD1FF] mx-auto" />
      </div>
      <div className="mt-24 relative z-[1] after:z-[-1] after:bg-none after:w-[135%] after:h-[89px] after:content-[''] after:absolute after:top-[-16px] after:left-0 after:rounded-tl-lg after:rounded-bl-lg before:w-[8px] before:h-[185%] before:bg-none before:absolute before:top-[-16px] before:right-[-36px] before:content-[''] before:rounded-tl-lg before:rounded-bl-lg">
        <AiFillSetting className="text-5xl text-[#BAD1FF] mx-auto" />
      </div>
      <div
        onClick={handleLogOut}
        className="mt-24 relative z-[1] after:z-[-1] after:bg-none after:w-[135%] after:h-[89px] after:content-[''] after:absolute after:top-[-16px] after:left-0 after:rounded-tl-lg after:rounded-bl-lg before:w-[8px] before:h-[185%] before:bg-none before:absolute before:top-[-16px] before:right-[-36px] before:content-[''] before:rounded-tl-lg before:rounded-bl-lg"
      >
        <FiLogOut className="text-5xl text-[#BAD1FF] mx-auto" />
      </div>
    </div>
  );
};

export default Sidebar;
