import React from "react";
import Chat from "../../components/Chat";
import Friends from "../../components/Friends";
import MsgGroups from "../../components/MsgGroups";
import Seacrh from "../../components/Seacrh";
import Sidebar from "../../components/Sidebar";
const Message = () => {
  return (
    <div className="flex gap-x-11">
      <div className="w-[186px] pl-2.5">
        <Sidebar active="msg" />
      </div>
      <div className="w-[427px]">
        <Seacrh />
        <MsgGroups />
        <Friends />
      </div>
      <div className="w-[650px]">
        <Chat />
      </div>
    </div>
  );
};

export default Message;
