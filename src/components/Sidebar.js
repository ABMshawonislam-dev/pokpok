import React, { useState } from "react";
import { AiOutlineHome, AiFillSetting } from "react-icons/ai";
import { RiMessage2Fill } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdCloudUpload } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLoginInfo } from "../slices/userSlice";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
const Sidebar = ({ active }) => {
  const auth = getAuth();
  const storage = getStorage();
  let dispatch = useDispatch();
  let navigate = useNavigate();

  let data = useSelector((state) => state.userLoginInfo.userInfo);

  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [imguploadmodal, setImguploadmodal] = useState(false);

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

  let handleImageUpload = () => {
    setImguploadmodal(true);
  };

  let handleImgUploadModal = () => {
    setImguploadmodal(false);
    setImage("");
    setCropData("");
    setCropper("");
  };

  const handleProfileUpload = (e) => {
    e.preventDefault();

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    console.log(files);

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());

      const storageRef = ref(storage, auth.currentUser.uid);
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            setImguploadmodal(false);
            setImage("");
            setCropData("");
            setCropper("");
          });
        });
      });
    }
  };
  return (
    <div className="w-full bg-primary h-screen rounded-3xl p-9">
      <div className="group relative w-28 h-28 rounded-full">
        <img
          className="mx-auto w-full h-full rounded-full"
          src={data.photoURL}
        />

        <div
          onClick={handleImageUpload}
          className="w-full h-full rounded-full opacity-0 group-hover:opacity-100 bg-[rgba(0,0,0,.4)] absolute top-0 left-0 flex justify-center items-center"
        >
          <MdCloudUpload className="text-white text-2xl" />
        </div>
      </div>
      <h2 className="font-nunito text-white text-center font-bold text-xl mt-5">
        {data.displayName}
      </h2>
      <div
        className={`mt-24 relative z-[1] after:z-[-1] ${
          active == "home" && "after:bg-white"
        }  after:w-[135%] after:h-[89px] after:content-[''] after:absolute after:top-[-16px] after:left-0 after:rounded-tl-lg after:rounded-bl-lg before:w-[8px] before:h-[185%] before:bg-primary before:absolute before:top-[-16px] before:right-[-36px] before:content-[''] before:rounded-tl-lg before:rounded-bl-lg`}
      >
        <Link to="/">
          <AiOutlineHome
            className={`text-5xl ${
              active == "home" ? "text-[#5F35F5]" : "text-[#BAD1FF]"
            } mx-auto`}
          />
        </Link>
      </div>
      <div
        className={`mt-24 relative z-[1] after:z-[-1] ${
          active == "msg" && "after:bg-white"
        }  after:w-[135%] after:h-[89px] after:content-[''] after:absolute after:top-[-16px] after:left-0 after:rounded-tl-lg after:rounded-bl-lg before:w-[8px] before:h-[185%] before:bg-primary before:absolute before:top-[-16px] before:right-[-36px] before:content-[''] before:rounded-tl-lg before:rounded-bl-lg`}
      >
        <Link to="/message">
          <RiMessage2Fill
            className={`text-5xl ${
              active == "msg" ? "text-[#5F35F5]" : "text-[#BAD1FF]"
            } mx-auto`}
          />
        </Link>
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

      {imguploadmodal && (
        <div className="w-full z-50 h-screen bg-primary absolute top-0 left-0 flex justify-center items-center">
          <div className="w-2/4 bg-white rounded-lg p-5">
            <h2 className="font-nunito text-center md:text-left font-bold text-3xl  lg:text-4xl text-heading">
              Upload Your Profile
            </h2>
            {image ? (
              <div className="group relative w-28 h-28 overflow-hidden rounded-full mx-auto">
                <div className="img-preview w-full h-full rounded-full" />
              </div>
            ) : (
              <div className="group relative w-28 h-28 overflow-hidden rounded-full mx-auto">
                <img
                  className="mx-auto w-full h-full rounded-full"
                  src={data}
                />
              </div>
            )}

            <input
              onChange={handleProfileUpload}
              className="mt-8"
              type="file"
            />
            <br />
            {image && (
              <Cropper
                style={{ height: 400, width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
                guides={true}
              />
            )}
            <button
              onClick={getCropData}
              className="px-8 bg-primary rounded font-nunito font-semibold text-xl text-white py-5 mt-8"
            >
              Upload
            </button>
            <button
              onClick={handleImgUploadModal}
              className="px-8 bg-red-500 rounded font-nunito font-semibold text-xl text-white py-5 ml-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
