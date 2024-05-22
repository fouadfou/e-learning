"use client"
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { useState ,useEffect} from "react";

import { isAdmin } from '../utils/userRequestes';

import { BiSolidErrorCircle } from "react-icons/bi";
import { FaUser} from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { SiOpslevel } from "react-icons/si";
import { BsArrowLeftShort } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import { MdOutlineFormatListNumberedRtl } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { FaBookOpen } from "react-icons/fa";
import { RiParentFill } from "react-icons/ri";
import { GiKnapsack } from "react-icons/gi";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { VscSaveAs } from "react-icons/vsc";
import { PiStudentFill } from "react-icons/pi";

import { redirect } from "next/navigation";



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
      name: 'Utilisateurs',
      icon: <FaUser />,
      link: "/users"
  },
  {
    name: 'Élèves',
    icon: <PiStudentFill />,
    link: "/students"
},

  {
    name: 'Parents/Enfants',
    icon: <RiParentFill  />,
    link: "/parentsChildrens"
},
  {
    name: 'Années',
    icon: <FaCalendarAlt  />,
    link: "/year"
},
{
  name: 'Trimestres',
  icon: <MdOutlineFormatListNumberedRtl   />,
  link: "/trimester"
},

{
  name: 'emplois du temps',
  icon: <MdOutlineAccessTimeFilled   />,
  link: "/timetables"
},

  {
      name: 'Niveaux',
      icon: <SiOpslevel />,
      link: "/level"
  },
  {
    name: 'Class',
    icon: <SiGoogleclassroom />,
    link: "/class"
},
{
  name: 'Matières',
  icon: <FaBookOpen />,
  link: "/subject"
},
{
  name: 'Absences',
  icon: <GiKnapsack />,
  link: "/absences"
},
{
  name: 'Enregistrements',
  icon: <VscSaveAs />,
  link: "/records"
},
];



const adminLayout = ({children , pageProps}) => {

  const { userId, getToken } = useAuth();
  const { isSignedIn, user } = useUser();
  const [isAdminUser, setIsAdminUser] = useState(false);




 
    return ( 
     
      <>
      { isAdminUser === true ? (
        <div className="h-screen w-screen flex items-center justify-center text-lg font-medium"> Sorry ! just admin can access to this page
         <BiSolidErrorCircle className="text-[25px] text-primaryColor ml-2" /></div >
      ) : (
        <div className="flex">
          <DashboardSidebar  listElements={listElements} />
          {children}
        </div>
      )}
    </>
   
     );
  }
   
  export default adminLayout;
