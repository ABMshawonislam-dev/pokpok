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
const GroupList = () => {
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
        if (data.uid != item.val().adminid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });

      setGroupList(arr);
    });
  }, []);

  let handleGroupJoin = (item) => {
    set(push(ref(db, "groupjoinrequest")), {
      groupid: item.key,
      groupname: item.groupname,
      grouptagline: item.grouptagline,
      adminid: item.adminid,
      adminname: item.adminname,
      userid: data.uid,
      username: data.displayName,
    });
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[346px] overflow-y-scroll">
      <div className="relative">
        <h3 className="font-nunito font-bold text-xl">GroupList</h3>
        <button
          onClick={handleGroupButton}
          className="font-nunito font-bold text-xl bg-primary text-white py-1 px-2 rounded absolute top-[6px] right-[6px] text-primary"
        >
          {show ? "Go back" : "Create Group"}
        </button>
      </div>
      {show ? (
        <div className="mt-10">
          <input
            type="email"
            className="border border-solid border-secondary w-full p-3  mb-3 rounded outline-0"
            placeholder="Group Name"
            onChange={(e) => setGname(e.target.value)}
          />
          <input
            type="email"
            className="border border-solid border-secondary w-full p-3 mb-3 rounded outline-0"
            placeholder="Group Tagline"
            onChange={(e) => setGtag(e.target.value)}
          />
          <button
            onClick={handleGroupCreate}
            className="w-full bg-primary rounded font-nunito font-semibold text-xl text-white py-2.5 mt-3"
          >
            Create
          </button>
        </div>
      ) : (
        grouplist.map((item) => (
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
              <h3 className="font-nunito font-bold text-xl">
                {item.groupname}{" "}
              </h3>
              <p className="font-nunito font-bold text-sm text-[#4D4D4D]">
                {item.grouptagline}
              </p>
            </div>
            <div>
              <button
                onClick={() => handleGroupJoin(item)}
                className="font-nunito font-bold text-xl bg-primary text-white py-2.5 px-5 rounded"
              >
                Join
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GroupList;
