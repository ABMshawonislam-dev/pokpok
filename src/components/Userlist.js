import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, ref, onValue } from "firebase/database";
import { useSelector } from "react-redux";
const Userlist = () => {
  const db = getDatabase();

  let data = useSelector((state) => state.userLoginInfo.userInfo);
  console.log(data.uid);

  let [userlist, setUserlist] = useState([]);

  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid != item.key) {
          arr.push(item.val());
        }
      });
      setUserlist(arr);
    });
  }, []);

  return (
    <div className="w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[346px] overflow-y-scroll">
      <div className="relative">
        <h3 className="font-nunito font-bold text-xl">User List</h3>
        <BsThreeDotsVertical className="absolute top-[6px] right-[6px] text-primary" />
      </div>
      {userlist.map((item) => (
        <div className="flex gap-x-5 items-center border-b border-solid border-primary pb-3.5 mt-3.5">
          <div>
            <img
              className="w-[70px] h-[70px] rounded-full"
              src="images/demoimg.png"
            />
          </div>
          <div>
            <h3 className="font-nunito font-bold text-xl">{item.username} </h3>
            <p className="font-nunito font-bold text-sm text-[#4D4D4D]">
              {item.email}
            </p>
          </div>
          <div>
            <button className="font-nunito font-bold text-xl bg-primary text-white py-2.5 px-5 rounded">
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Userlist;
