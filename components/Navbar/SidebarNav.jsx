"use client"
import React from 'react'
import { motion } from "framer-motion";
import { navBarList } from "@/constants";
import Link from 'next/link';




const SidebarNav = ({setShow}) => {


  const framerText = delay => {
    return {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      transition: {
        delay: delay / 35,
        type:"spring",
        
        
      },
    }
  }
  


  return (
  
                    <ul className="text-gray-200  flex flex-col gap-2 ">
                      {navBarList.map((item , index) => (
                        <motion.li {...framerText(index)}
                          className="font-normal ease-linear duration-100 hover:font-bold items-center  text-primeColor hover:text-[#262626]   "
                          key={item.id}
                        >
                          <Link key={item.id} href={item.link} onClick={()=>setShow(prevState => !prevState)} >
                          
                                {item.title}
                            
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
        
  )
}

export default SidebarNav