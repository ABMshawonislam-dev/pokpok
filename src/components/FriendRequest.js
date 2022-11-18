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
const FriendRequest = () => {
  const db = getDatabase();
  let [friendrequestlist, setFriendrequestlist] = useState([]);
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  useEffect(() => {
    const firendrequestRef = ref(db, "firendrequest");
    onValue(firendrequestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().recieverid == data.uid) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setFriendrequestlist(arr);
    });
  }, []);

  let handleFriendAccept = (item) => {
    console.log(item);
    set(push(ref(db, "friend")), {
      ...item,
    }).then(() => {
      remove(ref(db, "firendrequest/" + item.id)).then(() => {
        console.log("delketed");
      });
    });
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[346px] overflow-y-scroll">
      <div className="relative">
        <h3 className="font-nunito font-bold text-xl">Friend Request</h3>
        <BsThreeDotsVertical className="absolute top-[6px] right-[6px] text-primary" />
      </div>
      {friendrequestlist.map((item) => (
        <div className="flex gap-x-5 items-center border-b border-solid border-primary pb-3.5 mt-3.5">
          <div>
            <img
              className="w-[70px] h-[70px] rounded-full"
              src="images/demoimg.png"
            />
          </div>
          <div>
            <h3 className="font-nunito font-bold text-xl">{item.sendername}</h3>
            <p className="font-nunito font-bold text-sm text-[#4D4D4D]">
              Hi Guys, Wassup!
            </p>
          </div>
          <div>
            <button
              onClick={() => handleFriendAccept(item)}
              className="font-nunito font-bold text-xl bg-primary text-white py-2.5 px-5 rounded"
            >
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequest;
