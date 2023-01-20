import React, { useEffect, useState } from "react";
import { BsTriangleFill } from "react-icons/bs";
import ModalImage from "react-modal-image";
import { GrGallery } from "react-icons/gr";
import { BsFillCameraFill, BsFillMicFill } from "react-icons/bs";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { AiFillCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  push,
} from "firebase/database";
import {
  getStorage,
  ref as sref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
  uploadBytes,
} from "firebase/storage";
import moment from "moment";
import { AudioRecorder } from "react-audio-voice-recorder";
import EmojiPicker from "emoji-picker-react";
import { BsFillEmojiSmileFill } from "react-icons/bs";

const Chat = () => {
  let db = getDatabase();
  const storage = getStorage();

  let [check, setCheck] = useState(false);
  let [captureImage, setCaptureImage] = useState("");
  let [msg, setMsg] = useState("");
  let [msglist, setMsglist] = useState([]);
  let [audiourl, setAudioUrl] = useState("");
  let [blob, setBlob] = useState("");
  let [showemoji, setShowEmoji] = useState(false);

  let activeChatName = useSelector((state) => state.activeChat);
  console.log(activeChatName.active.name);
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  function handleTakePhoto(dataUri) {
    console.log(dataUri);
    setCaptureImage(dataUri);
    const storageRef = sref(storage, "tintinatin");
    uploadString(storageRef, dataUri, "data_url").then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        set(push(ref(db, "singlemsg")), {
          whosendid: data.uid,
          whosendname: data.displayName,
          whoreceiveid: activeChatName.active.id,
          whoreceivename: activeChatName.active.name,
          img: downloadURL,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
        }).then(() => {
          setCheck(false);
        });
      });
    });
  }

  let handleMsgSend = () => {
    if (activeChatName.active.status == "single") {
      set(push(ref(db, "singlemsg")), {
        whosendid: data.uid,
        whosendname: data.displayName,
        whoreceiveid: activeChatName.active.id,
        whoreceivename: activeChatName.active.name,
        msg: msg,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
      });
    } else {
      console.log("ami group msg");
    }
  };

  useEffect(() => {
    onValue(ref(db, "singlemsg"), (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().whosendid == data.uid &&
            item.val().whoreceiveid == activeChatName.active.id) ||
          (item.val().whoreceiveid == data.uid &&
            item.val().whosendid == activeChatName.active.id)
        ) {
          arr.push(item.val());
        }
      });
      setMsglist(arr);
    });
  }, [activeChatName.active.id]);

  let handleImageUpload = (e) => {
    console.log(e.target.files[0]);
    const storageRef = sref(storage, e.target.files[0].name);

    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log("errpr", error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          set(push(ref(db, "singlemsg")), {
            whosendid: data.uid,
            whosendname: data.displayName,
            whoreceiveid: activeChatName.active.id,
            whoreceivename: activeChatName.active.name,
            img: downloadURL,
            date: `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
          });
        });
      }
    );
  };

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setBlob(blob);
  };

  let handleAudioUpload = () => {
    const audioStorageRef = sref(storage, audiourl);

    // 'file' comes from the Blob or File API
    uploadBytes(audioStorageRef, blob).then((snapshot) => {
      getDownloadURL(audioStorageRef).then((downloadURL) => {
        set(push(ref(db, "singlemsg")), {
          whosendid: data.uid,
          whosendname: data.displayName,
          whoreceiveid: activeChatName.active.id,
          whoreceivename: activeChatName.active.name,
          audio: downloadURL,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
        }).then(() => {
          setAudioUrl("");
        });
      });
    });
  };

  let handelEmojiSelect = (emoji) => {
    console.log("ami emoji", emoji.emoji);
    setMsg(msg + emoji.emoji);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl py-6 px-12">
      <div className="flex items-center gap-x-8  border-b border-solid border-[rgba(0,0,0,.25)] pb-6 mb-14">
        <div className="w-[75px] h-[75px] rounded-full shadow-lg relative">
          <img src="images/profile.png" />
          <div className="w-[14px] h-[14px] rounded-full bg-green-500 border border-solid border-white absolute bottom-[11px] right-0 shadow-lg"></div>
        </div>
        <div>
          <h3 className="font-pop font-semibold text-2xl">
            {activeChatName.active.name}
          </h3>
          <p className="font-pop font-regular text-sm">Online</p>
        </div>
      </div>
      <div>
        <div className="overflow-y-scroll h-[400px] border-b border-solid border-[#f1f1f1]">
          {activeChatName.active.status == "single" ? (
            msglist.map((item) =>
              item.whosendid == data.uid ? (
                item.msg ? (
                  <div className="mb-8 text-right">
                    <div className="bg-primary inline-block py-3 px-12 rounded-md relative mr-5">
                      <p className="font-pop font-medium text-base text-white text-left">
                        {item.msg}
                      </p>
                      <BsTriangleFill className="text-2xl absolute bottom-[-2px] right-[-7px] text-primary" />
                    </div>
                    <p className="font-pop font-medium text-sm text-[rgba(0,0,0,.25)] mr-5">
                      {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                    </p>
                  </div>
                ) : item.img ? (
                  <div className="mb-8 text-right">
                    <div className="bg-primary inline-block w-60 p-3 rounded-md relative mr-5">
                      <ModalImage small={item.img} large={item.img} />
                      <BsTriangleFill className="text-2xl absolute bottom-[-2px] right-[-7px] text-primary" />
                    </div>
                    <p className="font-pop font-medium text-sm text-[rgba(0,0,0,.25)] mr-5">
                      {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                    </p>
                  </div>
                ) : (
                  <div className="mb-8 text-right">
                    <div className="inline-block mr-5">
                      <audio controls src={item.audio}></audio>
                    </div>
                    <p className="font-pop font-medium text-sm text-[rgba(0,0,0,.25)] mr-5">
                      Today, 2:01pm
                    </p>
                  </div>
                )
              ) : item.msg ? (
                <div className="mb-8">
                  <div className="bg-[#f1f1f1] inline-block py-3 px-12 rounded-md relative ml-5">
                    <p className="font-pop font-medium font-base">{item.msg}</p>
                    <BsTriangleFill className="text-2xl absolute bottom-[-2px] left-[-7px] text-[#f1f1f1]" />
                  </div>
                  <p className="font-pop font-medium text-sm text-[rgba(0,0,0,.25)] ml-5">
                    {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                  </p>
                </div>
              ) : item.img ? (
                <div className="mb-8">
                  <div className="bg-[#f1f1f1] inline-block w-60 p-3 rounded-md relative ml-5">
                    <ModalImage small={item.img} large={item.img} />
                    <BsTriangleFill className="text-2xl absolute bottom-[-2px] left-[-7px] text-[#f1f1f1]" />
                  </div>
                  <p className="font-pop font-medium text-sm text-[rgba(0,0,0,.25)] ml-5">
                    {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                  </p>
                </div>
              ) : (
                <div className="mb-8">
                  <div className="inline-block mr-5">
                    <audio controls src={item.audio}></audio>
                  </div>
                  <p className="font-pop font-medium text-sm text-[rgba(0,0,0,.25)] ml-5">
                    Today, 2:01pm
                  </p>
                </div>
              )
            )
          ) : (
            <h1>ami group msg</h1>
          )}
          {/* received msg start */}
          {/* <div className="mb-8">
            <div className="bg-[#f1f1f1] inline-block py-3 px-12 rounded-md relative ml-5">
              <p className="font-pop font-medium font-base">Hey There !</p>
              <BsTriangleFill className="text-2xl absolute bottom-[-2px] left-[-7px] text-[#f1f1f1]" />
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,.25)] ml-5">
              Today, 2:01pm
            </p>
          </div> */}
          {/* received msg end */}

          {/* send msg start */}
          {/* <div className="mb-8 text-right">
            <div className="bg-primary inline-block py-3 px-12 rounded-md relative mr-5">
              <p className="font-pop font-medium text-base text-white text-left">
                Hello...
              </p>
              <BsTriangleFill className="text-2xl absolute bottom-[-2px] right-[-7px] text-primary" />
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,.25)] mr-5">
              Today, 2:01pm
            </p>
          </div> */}
          {/* send msg end */}

          {/* received img start */}
          {/* <div className="mb-8">
            <div className="bg-[#f1f1f1] inline-block w-60 p-3 rounded-md relative ml-5">
              <ModalImage
                small={"images/login.png"}
                large={"images/login.png"}
              />
              <BsTriangleFill className="text-2xl absolute bottom-[-2px] left-[-7px] text-[#f1f1f1]" />
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,.25)] ml-5">
              Today, 2:01pm
            </p>
          </div> */}
          {/* received img end */}

          {/* send msg start */}
          {/* <div className="mb-8 text-right">
            <div className="bg-primary inline-block w-60 p-3 rounded-md relative mr-5">
             
              <ModalImage
                small={"images/registration.png"}
                large={"images/registration.png"}
              />
              <BsTriangleFill className="text-2xl absolute bottom-[-2px] right-[-7px] text-primary" />
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,.25)] mr-5">
              Today, 2:01pm
            </p>
          </div> */}
          {/* send msg end */}
          {/* <div className="mb-8 text-right">
            <div className="inline-block mr-5">
              <audio controls></audio>
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,.25)] mr-5">
              Today, 2:01pm
            </p>
          </div> */}
          {/* send msg end */}
          {/* received img start */}
          {/* <div className="mb-8">
            <div className="inline-block mr-5">
              <audio controls></audio>
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,.25)] ml-5">
              Today, 2:01pm
            </p>
          </div> */}
          {/* received img end */}

          {/* send msg end */}
          {/* <div className="mb-8 text-right">
            <div className="inline-block mr-5">
              <video controls></video>
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,.25)] mr-5">
              Today, 2:01pm
            </p>
          </div> */}
          {/* send msg end */}
          {/* received img start */}
          {/* <div className="mb-8">
            <div className="inline-block mr-5">
              <video controls></video>
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,.25)] ml-5">
              Today, 2:01pm
            </p>
          </div> */}
          {/* received img end */}
        </div>
        <div className="flex mt-3 gap-x-3">
          <div className="w-[85%] relative">
            {!audiourl && (
              <>
                <input
                  onChange={(e) => setMsg(e.target.value)}
                  className="bg-[#f1f1f1] p-3 w-full rounded-lg"
                  value={msg}
                />
                <label>
                  <input
                    onChange={handleImageUpload}
                    className="hidden"
                    type="file"
                  />
                  <GrGallery className="absolute top-4 right-2" />
                </label>
                <BsFillCameraFill
                  onClick={() => setCheck(!check)}
                  className="absolute top-4 right-8"
                />
                <AudioRecorder
                  onRecordingComplete={(blob) => addAudioElement(blob)}
                />
                <BsFillEmojiSmileFill
                  onClick={() => setShowEmoji(!showemoji)}
                  className="absolute top-4 right-20"
                />
                {showemoji && (
                  <div className="absolute top-[-450px] right-0">
                    <EmojiPicker
                      onEmojiClick={(emoji) => handelEmojiSelect(emoji)}
                    />
                  </div>
                )}
              </>
            )}
            {audiourl && (
              <div className=" flex gap-x-2.5">
                <audio controls src={audiourl}></audio>
                <button
                  className="bg-primary p-3 rounded-md text-white"
                  onClick={() => setAudioUrl("")}
                >
                  Delete
                </button>
                <button
                  onClick={handleAudioUpload}
                  className="bg-primary p-3 rounded-md text-white"
                >
                  Send
                </button>
              </div>
            )}
          </div>
          {check && (
            <div className="w-full h-screen absolute top-0 left-0 bg-[rgba(0,0,0,.9)] z-50 flex justify-center items-center">
              <AiFillCloseCircle
                onClick={() => setCheck(false)}
                className="text-white"
              />
              <Camera
                onTakePhoto={(dataUri) => {
                  handleTakePhoto(dataUri);
                }}
                idealFacingMode={FACING_MODES.ENVIRONMENT}
                idealResolution={{ width: 640, height: 480 }}
                imageType={IMAGE_TYPES.JPG}
                imageCompression={0.97}
                isMaxResolution={true}
                isImageMirror={true}
                isSilentMode={false}
                isDisplayStartCameraError={false}
                isFullscreen={true}
                sizeFactor={1}
              />
            </div>
          )}
          {!audiourl && (
            <button
              onClick={handleMsgSend}
              className="bg-primary p-3 rounded-md text-white"
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
