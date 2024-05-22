"use client"
import React from 'react'
import { IoMdArrowDropleft } from "react-icons/io";
import { greenBg } from "@/public/images";
import Link from "next/link"
import { BsArrowLeftShort } from "react-icons/bs";
import {User} from "@nextui-org/react";

import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';


import {
    useUser,
    useClerk,
    useAuth
  } from "@clerk/nextjs"; 


 

const DashboardSidebar = ({listElements , userShow , role}) => {
  const { isSignedIn, user } = useUser();

  const pathname = usePathname();




    const bg = {
        backgroundImage: `url(${greenBg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow:"rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px"
      };
    
     
  return (
    <div  style={{boxShadow:"rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px"}} className={`sticky ${role === "Admin" ? "top-[3.2rem] min-w-[11rem]":"top-0 min-w-[15rem]"} overflow-auto h-screen p-4 pt-1  flex flex-col gap-4 `}>
        <Link className={`${userShow}`} href="/">
        <BsArrowLeftShort className=' absolute top-[0.7rem] left-[0.5rem] rounded-full border-[5px] border-white text-[32px] cursor-pointer  hover:scale-110 duration-100 ease-linear text-white bg-primaryColor ' />
        </Link>
        
        <User   
        classNames={{description:"font-normal text-default-500 text-[13px]",name:"text-[16px]" , wrapper:"flex flex-col  items-center"}}
        className={`${userShow} bg-grayBg p-3 flex-col font-semibold `}
          name={user?.username}
          description={user?.primaryEmailAddress?.emailAddress}
          avatarProps={{
            src: user?.imageUrl
          }}
        />
        
        
        <ul  className={`${userShow && "mt-4"} flex flex-col gap-2`}>
        
          {listElements.map((ele, index) => (
            <Link key={index} href={`${role === "Teacher" ? "/teacherSpace": role ==="Parent" ? "/parentSpace": "/admindashboard"}${ele.link}`}>
              <li className="group flex items-center rounded-lg hover:bg-grayBg duration-300   p-2 justify-center gap-4 cursor-pointer">
                <span className="text-[#BCBCBC] text-[15px]">{ele.icon}</span>
                
                <p className="text-default-800 text-wrap text-[14px] group-hover:font-medium font-medium duration-100 ease-linear group-hover:text-[15px]">{ele.name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
  )
}

export default DashboardSidebar