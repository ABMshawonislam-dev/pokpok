import React from "react";
import { BsSearch, BsThreeDotsVertical } from "react-icons/bs";

const Seacrh = () => {
  return (
    <div className="relative">
      <input
        className="w-full rounded-lg p-5 pl-[78px] shadow-lg outline-0"
        type="text"
        placeholder="Search"
      />
      <BsSearch className="absolute top-[26px] left-[30px]" />
      <BsThreeDotsVertical className="absolute top-[26px] right-[30px] text-primary" />
    </div>
  );
};

export default Seacrh;
