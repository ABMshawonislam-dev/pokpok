import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Blockuser from "../../components/Blockuser.js";
import FriendRequest from "../../components/FriendRequest.js";
import Friends from "../../components/Friends.js";
import GroupList from "../../components/GroupList.js";
import Mygroups from "../../components/Mygroups.js";
import Seacrh from "../../components/Seacrh.js";
import Sidebar from "../../components/Sidebar.js";
import Userlist from "../../components/Userlist.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../slices/userSlice";
const Home = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  let auth = getAuth();
  let [verify, setVerify] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user.emailVerified) {
      setVerify(true);
      dispatch(userLoginInfo(user));
      localStorage.setItem("userInfo", JSON.stringify(user));
    }
  });

  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="flex gap-x-11">
      {verify ? (
        <>
          <div className="w-[186px] pl-2.5">
            <Sidebar active="home" />
          </div>
          <div className="w-[427px]">
            <Seacrh />
            <GroupList />
            <FriendRequest />
          </div>
          <div className="w-[427px]">
            <Friends />
            <Mygroups />
          </div>
          <div className="w-[427px]">
            <Userlist />
            <Blockuser />
          </div>
        </>
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          <h1 className="bg-primary font-nunito font-bold text-5xl p-5 text-white">
            please verify your email
          </h1>
        </div>
      )}
    </div>
  );
};

export default Home;
