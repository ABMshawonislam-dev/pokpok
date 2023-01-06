import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

import {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  push,
} from "firebase/database";
import { useSelector, useDispatch } from "react-redux";

import { activeChat } from "../slices/activeChatSlice";

const Friends = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  let dispatch = useDispatch();

  console.log(data.uid);

  let [friends, setFriends] = useState([]);

  useEffect(() => {
    const friendRef = ref(db, "friend");
    onValue(friendRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        console.log(item.val());
        if (
          data.uid == item.val().recieverid ||
          data.uid == item.val().senderid
        ) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setFriends(arr);
    });
  }, []);

  let handleBlock = (item) => {
    console.log(item, "asdasd");
    if (data.uid == item.senderid) {
      set(push(ref(db, "block")), {
        block: item.recievername,
        blockid: item.recieverid,
        blockby: item.sendername,
        blockbyid: item.senderid,
      }).then(() => {
        console.log("kire");
        remove(ref(db, "friend/" + item.key));
      });
    } else {
      set(push(ref(db, "block")), {
        block: item.sendername,
        blockid: item.senderid,
        blockby: item.recievername,
        blockbyid: item.recieverid,
      }).then(() => {
        console.log("kire");
        remove(ref(db, "friend/" + item.key));
      });
    }
  };

  let handleActiveSingle = (item) => {
    if (item.recieverid == data.uid) {
      dispatch(
        activeChat({
          status: "single",
          id: item.senderid,
          name: item.sendername,
        })
      );
    } else {
      dispatch(
        activeChat({
          status: "single",
          id: item.recieverid,
          name: item.recievername,
        })
      );
    }
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[346px] overflow-y-scroll">
      <div className="relative">
        <h3 className="font-nunito font-bold text-xl">Friends</h3>
        <BsThreeDotsVertical className="absolute top-[6px] right-[6px] text-primary" />
      </div>
      {friends.map((item) => (
        <div
          onClick={() => handleActiveSingle(item)}
          className="flex gap-x-5 items-center border-b border-solid border-primary pb-3.5 mt-3.5"
        >
          <div>
            <img
              className="w-[70px] h-[70px] rounded-full"
              src="images/demoimg.png"
            />
          </div>
          <div>
            <h3 className="font-nunito font-bold text-xl">
              {data.uid == item.senderid ? item.recievername : item.sendername}
            </h3>
            <p className="font-nunito font-bold text-sm text-[#4D4D4D]">
              Hi Guys, Wassup!
            </p>
          </div>
          <div>
            <button
              onClick={() => handleBlock(item)}
              className="font-nunito font-bold text-xl bg-primary text-white py-2.5 px-5 rounded"
            >
              Block
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Friends;
