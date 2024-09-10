"use client";

import React, { useEffect, useState , useRef} from "react";
import Link from "next/link";
import { HiMenuAlt2 } from "react-icons/hi";
import { motion } from "framer-motion";
import { navBarList } from "@/constants";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { RiSettings3Fill } from "react-icons/ri";
import { HiLogout } from "react-icons/hi";
import SidebarNav from "./SidebarNav";
import Sidebar from "../sidebar/Sidebar";
import {
  Image,
  User,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem , Popover,PopoverContent,PopoverTrigger
} from "@nextui-org/react";

import { FaUser} from "react-icons/fa";
import { TbLogin2 } from "react-icons/tb";
import { FiUserPlus } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { HiMiniEllipsisVertical } from "react-icons/hi2";
import { MdSpaceDashboard } from "react-icons/md";


import {
  useUser,
  useClerk,
  useAuth
} from "@clerk/nextjs"; 

import { getUserRole } from "@/app/utils/userRequestes";




const Navbar = () => {

  const { userId, getToken } = useAuth();
  const { isSignedIn, user } = useUser();

  const [userRole, setUserRole] = useState("");
  const { signOut, openUserProfile } = useClerk();

  const router = useRouter()
  const [sidenav, setSidenav] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
 



  let pathname = usePathname();

  useEffect(() => {
    const fetchUserRole = async () => {

        try {

          const token = await getToken({ template: "supabase" });
          const role = await getUserRole({ userId, token });
          setUserRole(role.role);          
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      
    };

    isSignedIn && fetchUserRole();

  }, [isSignedIn]);



  return (
    <header
      className={` ${pathname === "/sign-in" || pathname === "/sign-up" || pathname === "/admindashboard" || /^\/admindashboard\/(.*)$/.test(pathname) ? "hidden" : "sticky"} top-0 z-40 w-full h-[3.2rem] overflow-hidden bg-white border-b-[1px] border-b-gray-200 `}
    >
      <nav className="h-full px-5  max-w-container mx-auto relative">
        <div className="flex items-center md:justify-between h-full">

          <div className= "flex justify-between items-center  md:gap-4">
          <Link href="/" className=" flex items-center">
            <h1
             
              className="text-primeColor font-bold  text-[18px] "
            >
              Pickr
            </h1>
          </Link>
          <HiMiniEllipsisVertical  className="text-lg text-primeColor"/>
          </div>
          <div className="flex w-full  md:justify-between">
         
              <motion.ul
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="hidden md:flex      items-center w-auto  p-0 gap-2  md:ml-1"
              >
                {navBarList.map(({ id, title, link }) => (

                  
                  <li className={(!isSignedIn || userRole === "Admin") && link==="Space"  ? "hidden" : ""} key={id}>
                   <Link
                      href={link === "Space" ? `/${userRole.toLowerCase()}${link}` : link}
                      className={`flex font-normal whitespace-nowrap text-sm ease-linear duration-100 hover:font-bold w-24 h-6 justify-center items-center   text-primeColor  ${
                        pathname === link
                          ? "md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                          : ""
                      }`}
                      key={id}
                    >
                      {title !== "Space" ?  title : userRole === 'Teacher' ? "EspaceEnseignant" : userRole ==="Parent" ?"Espace Parent":"" }
                    </Link>
                  </li>
                ))}
              </motion.ul>
              
            
            
            <div className="flex w-full justify-end items-center ml-1 lg:ml-0 ">

              {/* <div className="flex   items-center justify-between pl-1 py-1 px-3 w-full lg:w-[15rem] h-full rounded-full mr-2  hover:bg-[#e1e1e1] bg-[#f1f1f1] bg-grayBg">
                <div className="bg-primaryColor p-[0.35rem] rounded-full">
                <IoIosSearch className=" text-white rounded-md max-h-full" />
                
                </div>
                <input type="text" className=" w-[88%] ml-2 outline-none bg-transparent text-sm placeholder:text-[12px]" placeholder='Search people, pages,or groupes' />
              </div> */}



        {!isSignedIn ? (

              <Popover open={isOpen} isOpen={isOpen}
              onClose={() => setIsOpen(!isOpen)} placement="bottom" offset={20} showArrow>
                  <PopoverTrigger>
                  <div onClick={() => setIsOpen(!isOpen)} className="flex bg-[#f1f1f1] p-[0.63rem] items-center justify-center cursor-pointer rounded-full duration-100">
                <div    className="flex">
                <FaUser className="text-[#767676] text-[14px]" />
              </div>
                </div>
              </PopoverTrigger>
              <PopoverContent  >
                <div className="p-1 px-0">
                  <Link href="/sign-in" onClick={()=>setIsOpen(false)} >
                    <div className="flex text-[#565656]   hover:bg-grayBg items-center gap-3 p-2  px-3 rounded-lg ">
                      <TbLogin2 className="text-[#BCBCBC]" />
                      <p className="text-[13px]">Se connecter</p>
                      
                    </div>
                  </Link>
                 {/*  <Link href="/sign-up" onClick={()=>setIsOpen(false)} >
                    <div  className="flex text-[#565656]  hover:bg-grayBg  items-center gap-3 p-2 px-3  rounded-lg ">
                      <FiUserPlus className="text-[#BCBCBC] "/>
                      <p className="text-[13px]">S'inscrire</p>
                      
                    </div>
                  </Link> */}
                </div>
              </PopoverContent>
              </Popover>
        ):(
          <Popover open={isOpen} isOpen={isOpen}
          onClose={() => setIsOpen(!isOpen)} placement="bottom" offset={20} showArrow>
            <PopoverTrigger className="w-8 h-8 rounded-full cursor-pointer">
          
            
            <Image onClick={() => setIsOpen(!isOpen)}  alt="user.img" src={user?.imageUrl}  />
          
          
      </PopoverTrigger>
      <PopoverContent>
        <div  className="px-1 py-2">
        
              <User
 
                name={user?.username}
                description={user?.primaryEmailAddress?.emailAddress}
                avatarProps={{
                  src: user?.imageUrl,
                }}
                {...{
                  locale: 'fr', // for French
                }}
              />
              

              {userRole === "Admin" && (
                <Link  onClick={()=>setIsOpen(false)} href="/admindashboard"  className="flex cursor-pointer hover:bg-grayBg p-3 rounded-lg  items-center gap-4 text-[13px] tracking-wide text-[#565656]">
                <MdSpaceDashboard  className="text-[14px] text-[#BCBCBC]" />
                  <span>Page d'administration</span>
                </Link>
              )
              
              }
              <div onClick={() => openUserProfile()} className="flex cursor-pointer hover:bg-grayBg p-3 rounded-lg  items-center gap-4 text-[13px] tracking-wide text-[#565656]">
                 <RiSettings3Fill className="text-[14px] text-[#BCBCBC]" />
                <span>Gérer son compte</span>
              </div>
              <div onClick={() => signOut(() => router.push('/'))}  className="flex cursor-pointer  items-center hover:bg-grayBg p-3 rounded-lg gap-4 text-[13px] tracking-wide text-[#565656]">
              <HiLogout className="text-[14px] text-[#BCBCBC]" />
              <span>se déconnecter</span>

              </div>
        </div>
      </PopoverContent>
      </Popover>
        )
              }

        

            <div onClick={() => setSidenav(true)} className="md:hidden cursor-pointer p-[0.58rem] ml-2 bg-grayBg  rounded-full">
              <HiMenuAlt2
                
                className=" rounded-lg text-[#767676]   "
              />
            </div>
            </div>
        
            {sidenav && <Sidebar  show={sidenav} setShow={setSidenav}  title="Pickr" Content={SidebarNav} />}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default  Navbar;
