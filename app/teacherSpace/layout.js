"use client"
import { useState ,useEffect} from "react";
import { supabaseClient } from '@/app/utils/supabaseClient';

import { redirect } from "next/navigation";
import { BsFileTextFill } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";
import { AiFillMessage } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import ChatList from "./ChatList";
import { Badge } from "@nextui-org/react";



import DashboardSidebar from "@/components/sidebar/DashboardSidebar";




import {
  useUser,
  useAuth
} from "@clerk/nextjs"; 


const listElements = [
    {
        name: 'Accueil',
        icon: <GoHomeFill />,
        link: "/"
    },
    {
        name: 'Devoirs',
        icon: <BsFileTextFill />,
        link: "/devoir"
    },
    {
      name: 'les notes',
      icon: <BsFileTextFill />,
      link: "/note"
  },
 
  ];



const teacherLayout = ({ children }) => {

    const { userId, getToken } = useAuth();
    const [showChatList , setShowChatList] = useState(false);
    const [ messages_sent, setMessages_sent] = useState(false); 



    return ( 
       
        <div className="flex">
        <DashboardSidebar  role="Teacher" userShow="hidden" listElements={listElements}/>
           
            <div className='fixed bottom-4 right-4 '>
                <div>
                <ChatList setMessages_sent={setMessages_sent} userId={userId} getToken={getToken} showChatList={showChatList} />

              

                  </div>
                  <Badge size="sm" className={`${(showChatList || !messages_sent) && "opacity-0"} z-50 border-0 top-2`}  content={""} color="danger" shape="rectangle">
                  <div onClick={() => setShowChatList((prev) => !prev)} style={{boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}} className='z-50 bg-grayBg ease-linear duration-100 cursor-pointer hover:scale-105 flex items-center justify-center text-2xl  w-[3rem] h-[3rem] border text-default-600 rounded-full' >
                      {showChatList ? <IoClose /> : <AiFillMessage  />} 
                </div>
                </Badge>
            </div>
        <div className="p-8 pt-14 md:pt-8 md:ml-[14rem] md:max-w-[calc(100%-14rem)] w-full">
        {children}
        </div>
      </div>
      
   
     );
  }
   
  export default teacherLayout;
