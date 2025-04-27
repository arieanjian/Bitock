import React from "react";
import logo from "../assets/logo.png";
const Header = ({ setSidebarOpen }) => {
  return (
    <div className="relative flex justify-center items-center px-2 py-2 w-full border-0 border-b border-gray-200">
      <img src={logo} alt="logo" className="w-20 h-10" />
      {/* 漢堡按鈕（小於1440px才顯示） */}
      <button
        className=" xl:hidden  bg-white rounded-full p-2 shadow absolute left-2"
        onClick={() => setSidebarOpen(true)}
        aria-label="展開選單"
      >
        <span className="block w-4 h-0.5 bg-gray-800 mb-1 rounded"></span>
        <span className="block w-4 h-0.5 bg-gray-800 mb-1 rounded"></span>
        <span className="block w-4 h-0.5 bg-gray-800 rounded"></span>
      </button>
    </div>
  );
};

export default Header;
