"use client"
import { useState ,useEffect} from "react";
import { redirect } from "next/navigation";
import { BsFileTextFill } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";


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
 
  ];



const teacherLayout = ({ children }) => {

    const { userId, getToken } = useAuth();



 
    return ( 
       
        <div className="flex">
        <DashboardSidebar  role="Teacher" userShow="hidden" listElements={listElements}/>
        <div className="p-8 flex-1">
        {children}
        </div>
      </div>
      
   
     );
  }
   
  export default teacherLayout;
