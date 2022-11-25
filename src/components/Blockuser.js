import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
const Blockuser = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  let [blocklist, setBlocklist] = useState([]);

  useEffect(() => {
    const blockRef = ref(db, "block");
    onValue(blockRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().blockbyid == data.uid) {
          arr.push({
            id: item.key,
            block: item.val().block,
            blockid: item.val().blockid,
          });
        } else {
          arr.push({
            id: item.key,
            blockbyid: item.val().blockbyid,
            blockby: item.val().blockby,
          });
        }
      });
      setBlocklist(arr);
    });
  }, []);

  let handleUnblock = (item) => {
    set(push(ref(db, "friend")), {
      sendername: item.block,
      senderid: item.blockid,
      recieverid: data.uid,
      recievername: data.displayName,
    }).then(() => {
      remove(ref(db, "block/" + item.id)).then(() => {
        console.log("delketed");
      });
    });
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[346px] overflow-y-scroll">
      <div className="relative">
        <h3 className="font-nunito font-bold text-xl">Blocked Users</h3>
        <BsThreeDotsVertical className="absolute top-[6px] right-[6px] text-primary" />
      </div>
      {blocklist.map((item) => (
        <div className="flex gap-x-5 items-center border-b border-solid border-primary pb-3.5 mt-3.5">
          <div>
            <img
              className="w-[70px] h-[70px] rounded-full"
              src="images/demoimg.png"
            />
          </div>
          <div>
            <h3 className="font-nunito font-bold text-xl">{item.block}</h3>
            <h3 className="font-nunito font-bold text-xl">{item.blockby}</h3>
            <p className="font-nunito font-bold text-sm text-[#4D4D4D]">
              Hi Guys, Wassup!
            </p>
          </div>
          <div>
            {!item.blockbyid && (
              <button
                onClick={() => handleUnblock(item)}
                className="font-nunito font-bold text-xl bg-primary text-white py-2.5 px-5 rounded"
              >
                Unb
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blockuser;
