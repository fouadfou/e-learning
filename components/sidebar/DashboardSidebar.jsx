"use client";
import React, { useState } from 'react';
import { IoMdArrowDropleft } from "react-icons/io";
import Link from "next/link";
import { BsArrowLeftShort, BsList } from "react-icons/bs";
import { User } from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";
import { IoIosCloseCircle } from "react-icons/io";
import { usePathname } from 'next/navigation';

const DashboardSidebar = ({ listElements, userShow, role }) => {
  const { isSignedIn, user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname(); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className=' max-w-[14rem]  ' >
      {/* Toggle Button for Small Screens */}

      <Link href='/'
        className=" md:hidden fixed top-2 right-2 z-30  bg-primaryColor text-white p-2  rounded-full shadow-lg">
        <IoIosCloseCircle className="text-lg" />
      </Link>

      <button 
        onClick={toggleSidebar} 
        className={`${isSidebarOpen && "hidden"}  md:hidden fixed 
        ${pathname.includes('teacherSpace') ? 'top-16' : 'top-2'}   left-2 z-30 bg-primaryColor text-white p-2  rounded-full shadow-lg`}>
        <BsList className="text-lg" />
      </button>

      

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed overflow-y-auto min-w-[14rem] z-40 top-0 left-0 h-screen bg-white shadow-lg p-5 transition-transform duration-300 ease-in-out 
         ${pathname.includes('teacherSpace') ? 'top-[3.2rem]' : ''}`}
      >
        {/* Close Button for Small Screens */}
        <button 
          onClick={toggleSidebar} 
          className="md:hidden absolute top-[3px] right-[3px] z-50 text-gray-700">
          <IoIosCloseCircle  className="text-xl " />
        </button>

        {/* Back Arrow */}
        <Link href="/">
          <BsArrowLeftShort className="absolute top-[0.7rem] left-[0.5rem] rounded-full border-[5px] border-white text-[32px] cursor-pointer hover:scale-110 duration-100 ease-linear text-white bg-primaryColor" />
        </Link>

        {/* User Section */}
        {isSignedIn && (
          <User
            classNames={{
              description: "font-normal text-default-500 text-[13px]",
              name: "text-[16px]",
              wrapper: "flex flex-col items-center",
            }}
            className={`bg-grayBg w-full p-3 flex-col font-semibold rounded-lg`}
            name={user?.username}
            description={user?.primaryEmailAddress?.emailAddress}
            avatarProps={{
              src: user?.imageUrl,
            }}
          />
        )}

        {/* Navigation List */}
        <ul className="mt-4 flex flex-col gap-2 ">
          {listElements.map((ele, index) => (
            <Link
              key={index}
              href={`${
                role === 'Teacher' ? '/teacherSpace' : role === 'Parent' ? '/parentSpace' : '/admindashboard'
              }${ele.link}`}
            >
              <li className="group flex items-center rounded-lg hover:bg-grayBg duration-300 p-2 justify-start gap-4 cursor-pointer">
                <span className="text-[#BCBCBC] text-[15px]">{ele.icon}</span>
                <p className="text-default-800 text-[14px] font-medium ">
                  {ele.name}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      </div>

      {/* Overlay for small screens when sidebar is open */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
        />
      )}
    </div>
  );
};

export default DashboardSidebar;
