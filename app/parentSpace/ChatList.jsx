"use state"
import React , {useEffect, useState} from 'react'
import {AnimatePresence, motion } from 'framer-motion'
import { supabaseClient } from '../utils/supabaseClient'
import { AiFillMessage } from "react-icons/ai";
import ChatComponent from './ChatComponent';


const ChatList = ({showChatList, childrens , getToken}) => {
        
        const [teachers , setTeachers] = useState([]);

        useEffect(() => {
          const fetchTeachers = async () => {
            try {
              const token = await getToken({ template: 'supabase' });
              const supabase = await supabaseClient(token);
      
              // Extract all class_ids from childrens
              const classIds = childrens.map((child) => child.class_id);
      
              // Fetch teachers whose class_id matches any of the class_ids
              const { data, error } = await supabase
                .from('matiere_ensg')
                .select('* , ensg(user_id , users(nom,prenom))')
                .in('class_id', classIds);

                
               /*  const combinationObjects = data.map((item) => ({
                  class_id: item.class_id,
                  class_name: item.class_name,
                  id: item.id,
                  ensg_id: item.ensg_id,
                  ensg_nom: item.ensg.users.nom,
                  ensg_prenom: item.ensg.users.prenom,
                  matiere_name :item.matiere_name,
                  matiere_id: item.matiere_id,
                  matiere_eleve: [{ matiere_name: item.matiere_name, eleve: [] }],
                })); */

                const uniqueEnsg = data.reduce((unique, item) => {
                  // Check if unique already contains an object with the same ensg_id
                  const existing = unique.find((element) => element.ensg_id === item.ensg.user_id);
                  
                  // If there's no existing object with the same ensg_id, add this item to the unique array
                  if (!existing) {
                    unique.push({
                      ensg_id: item.ensg.user_id,
                      ensg_nom: item.ensg.users.nom,
                      ensg_prenom: item.ensg.users.prenom,
                    });
                  }
                
                  return unique;
                }, []);
              /*   for (const child of childrens) {
                  for (const obj of combinationObjects) {
                    if (child.class_id === obj.class_id) {
                      obj.matiere_eleve[0].eleve.push({
                        nom: child.nom,
                        prenom: child.prenom,
                      });
                    }
                  }
                }
                 */
console.log("combinationObjects" , uniqueEnsg)

              if (error) {
                throw error;
              }
      
             setTeachers(uniqueEnsg); 
            } catch (error) {
              console.error('Error fetching teachers:', error.message);
            }
          };
      
          childrens && fetchTeachers();
        }, [childrens, getToken]);

        

        
  return (
    <AnimatePresence className="relative  z-50 ">
      
       
       {showChatList && ( <motion.ul initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.5 , type:"spring" }}
          style={{ boxShadow: "rgba(0, 0, 0, 0.10) 0px 3px 4px" }}
          className="absolute  z-50 flex flex-col w-fit scroll-auto  max-h-[calc(75vh)]  bottom-14 right-0 bg-white rounded-xl border" >

            <h1 className='w-full tetx-sm  bg-[#5A5A5A] text-gray-100  rounded-t-xl p-2 text-center'>Teachers</h1>

        {teachers.map((teacher,index) => (
        <li className={`${index === teachers.length -1 && "border-b-0"} flex  w-full flex-col items-center  text-nowrap text-[13px] border-b p-4`} key={index}>
          <div className='flex gap-6 items-center w-full  justify-between'>
            <p className='font-medium'>{teacher.ensg_nom} {teacher.ensg_prenom}</p>
            <AiFillMessage  className='cursor-pointer hover:scale-110 ease-linear duration-100 text-gray-400 hover:text-gray-800 text-[16px]' />

            </div>

            <ChatComponent teacher_id={teacher.ensg_id} />
          
            {/* Add other properties you want to display */}
          </li>
        ))}
      </motion.ul>
       
      )}
    </AnimatePresence>
  )
}

export default ChatList