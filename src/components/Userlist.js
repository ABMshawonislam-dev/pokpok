import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";
const Userlist = () => {
  const db = getDatabase();

  let data = useSelector((state) => state.userLoginInfo.userInfo);
  console.log(data.uid);

  let [userlist, setUserlist] = useState([]);
  let [friendrequestlist, setFriendrequestlist] = useState([]);
  let [friendlist, setFriendlist] = useState([]);
  let [filteruserlist, setFilterUserList] = useState([]);

  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid != item.key) {
          arr.push({ ...item.val(), userid: item.key });
        }
      });
      setUserlist(arr);
    });
  }, []);

  let handleFriendRequest = (item) => {
    console.log(item);
    set(push(ref(db, "firendrequest")), {
      sendername: data.displayName,
      senderid: data.uid,
      recievername: item.username,
      recieverid: item.userid,
    });
  };

  useEffect(() => {
    const firendrequestRef = ref(db, "firendrequest");
    onValue(firendrequestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().recieverid + item.val().senderid);
      });
      setFriendrequestlist(arr);
    });
  }, []);

  useEffect(() => {
    const firendRef = ref(db, "friend");
    onValue(firendRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().recieverid + item.val().senderid);
      });
      setFriendlist(arr);
    });
  }, []);
  let handleSearch = (e) => {
    let arr = [];
    console.log(arr);
    if (e.target.value.length == 0) {
      setFilterUserList([]);
    } else {
      userlist.filter((item) => {
        console.log(item);
        if (
          item.username.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          arr.push(item);
          setFilterUserList(arr);
        }
      });
    }
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[346px] overflow-y-scroll">
      <div className="relative">
        <h3 className="font-nunito font-bold text-xl">User List</h3>
        <BsThreeDotsVertical className="absolute top-[6px] right-[6px] text-primary" />
        <input
          className="w-full rounded-lg p-2.5 shadow-lg outline-0"
          type="text"
          placeholder="Search"
          onChange={handleSearch}
        />
      </div>

      {filteruserlist.length > 0
        ? filteruserlist.map((item) => (
            <div className="flex gap-x-5 items-center border-b border-solid border-primary pb-3.5 mt-3.5">
              <div>
                <img
                  className="w-[70px] h-[70px] rounded-full"
                  src="images/demoimg.png"
                />
              </div>
              <div>
                <h3 className="font-nunito font-bold text-xl">
                  {item.username}{" "}
                </h3>
                <p className="font-nunito font-bold text-sm text-[#4D4D4D]">
                  {item.email}
                </p>
              </div>
              <div>
                {friendlist.includes(item.userid + data.uid) ||
                friendlist.includes(data.uid + item.userid) ? (
                  <button className="font-nunito font-bold text-xl bg-primary text-white py-2.5 px-5 rounded">
                    F
                  </button>
                ) : friendrequestlist.includes(item.userid + data.uid) ||
                  friendrequestlist.includes(data.uid + item.userid) ? (
                  <button className="font-nunito font-bold text-xl bg-primary text-white py-2.5 px-5 rounded">
                    P
                  </button>
                ) : (
                  <button
                    onClick={() => handleFriendRequest(item)}
                    className="font-nunito font-bold text-xl bg-primary text-white py-2.5 px-5 rounded"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))
        : userlist.map((item) => (
            <div className="flex gap-x-5 items-center border-b border-solid border-primary pb-3.5 mt-3.5">
              <div>
                <img
                  className="w-[70px] h-[70px] rounded-full"
                  src="images/demoimg.png"
                />
              </div>
              <div>
                <h3 className="font-nunito font-bold text-xl">
                  {item.username}{" "}
                </h3>
                <p className="font-nunito font-bold text-sm text-[#4D4D4D]">
                  {item.email}
                </p>
              </div>
              <div>
                {friendlist.includes(item.userid + data.uid) ||
                friendlist.includes(data.uid + item.userid) ? (
                  <button className="font-nunito font-bold text-xl bg-primary text-white py-2.5 px-5 rounded">
                    F
                  </button>
                ) : friendrequestlist.includes(item.userid + data.uid) ||
                  friendrequestlist.includes(data.uid + item.userid) ? (
                  <button className="font-nunito font-bold text-xl bg-primary text-white py-2.5 px-5 rounded">
                    P
                  </button>
                ) : (
                  <button
                    onClick={() => handleFriendRequest(item)}
                    className="font-nunito font-bold text-xl bg-primary text-white py-2.5 px-5 rounded"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))}
    </div>
  );
};

export default Userlist;
