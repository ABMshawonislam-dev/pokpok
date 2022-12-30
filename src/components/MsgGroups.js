import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";
const MsgGroups = () => {
  const db = getDatabase();

  let [show, setShow] = useState(false);
  let [gname, setGname] = useState("");
  let [gtag, setGtag] = useState("");

  let [grouplist, setGroupList] = useState([]);

  let data = useSelector((state) => state.userLoginInfo.userInfo);

  let handleGroupButton = () => {
    setShow(!show);
  };

  let handleGroupCreate = () => {
    set(push(ref(db, "group")), {
      groupname: gname,
      grouptagline: gtag,
      adminid: data.uid,
      adminname: data.displayName,
    }).then(() => {
      setShow(false);
    });
  };

  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), key: item.key });
      });

      setGroupList(arr);
    });
  }, []);

  return (
    <div className="w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[346px] overflow-y-scroll">
      <div className="relative">
        <h3 className="font-nunito font-bold text-xl">GroupList</h3>
      </div>

      {grouplist.map((item) => (
        <div className="flex gap-x-5 items-center border-b border-solid border-primary pb-3.5 mt-3.5">
          <div>
            <img
              className="w-[70px] h-[70px] rounded-full"
              src="images/demoimg.png"
            />
          </div>
          <div>
            <p className="font-nunito font-bold text-sm text-[#4D4D4D]">
              Admin: {item.adminname}
            </p>
            <h3 className="font-nunito font-bold text-xl">{item.groupname} </h3>
            <p className="font-nunito font-bold text-sm text-[#4D4D4D]">
              {item.grouptagline}
            </p>
          </div>
          <div>
            <button className="font-nunito font-bold text-xl bg-primary text-white py-2.5 px-5 rounded">
              msg
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MsgGroups;
