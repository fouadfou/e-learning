"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { family } from '@/public/images'
import { Button ,Badge , Snippet , Chip , Tabs, Tab , Popover , PopoverContent , PopoverTrigger} from '@nextui-org/react'
import { supabaseClient } from '../utils/supabaseClient'

import Email from './Email'
import ChildInfo from './fetchChildInfo/ChildInfo'
import Notes from './Notes'
import ChatList from './ChatList'
import FatchDevoir from './FetchDevoir'



import { AiFillMessage } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { FaMinus } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";



const familyBg = {
    backgroundImage: `linear-gradient(90deg, 
        rgba(0, 0, 0, 0.85) 20%, 
        rgba(0, 0, 0, 0.80) 30%, 
        rgba(0, 0, 0, 0.35) 40%, 
        rgba(0, 0, 0, 0.75) 75%, 
        rgba(0, 0, 0, 0.80) 100%), 
        url(${family.src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };


  


const page = () => {

    const {userId, getToken} = useAuth();
    const [parent, setParent] = useState({}); // Destructure the state variable and the setter function
    const [childrens, setChildrens] = useState([]); // Destructure the state variable and the setter function
    const [showChatList , setShowChatList] = useState(false);

    const [ messages_sent, setMessages_sent] = useState(false); 
    const [notifiedPages , setNotifiedPages] = useState([]);

    const tabref = useRef(null);


    useEffect(() => {
      const fetchDataNotSeen = async () => {

        const pages = [];
  
        for (const child of childrens) {
          try {
            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
            
            // Fetch notes based on class_id
            const { data:notesData, error } = await supabase
              .from('notes')
              .select("*,class(class_name)")
              .eq('class_id', child.class_id)
              .eq('seen',false)
            
  
            if (error) {
              throw error;
            }

            const { data: devoirsData, error: devoirsError } = await supabase
            .from('devoir')
            .select('*,class(class_name)')
            .eq('class_id', child.class_id)
            .eq('seen', false);


            
          if (notesData && notesData.length > 0) {
            pages.push('notes');
          }
          if (devoirsData && devoirsData.length > 0) {
            pages.push('devoirs');
          }
          
  
          } catch (error) {
            console.error('Error fetching notes:', error.message);
          }
        }

        setNotifiedPages(pages);
      };
  
      fetchDataNotSeen();
    }, [childrens, parent,userId]);

    




    const scrollToRef = () => {

        setTimeout(() => {
        tabref.current.scrollIntoView({ behavior: 'smooth' });
            
        }, 500);
    } 

    useEffect(() => {

        const getParent = async() => {
            
                try {
                  const token = await getToken({ template: 'supabase' });
                  const supabase = await supabaseClient(token);
                  const { data, error } = await supabase
                    .from("users")
                    .select("nom, prenom")
                    .eq("user_id", userId);

                  setParent(data[0]);
                } catch (error) {
                  console.error('Parent not found:', error.message);
                }
              }

        userId && getParent()
     
    }, [userId])


    useEffect(() => {

        const getChildrens = async() => {
            
                try {
                  const token = await getToken({ template: 'supabase' });
                  const supabase = await supabaseClient(token);
                  const { data, error } = await supabase
                    .from("parent_eleve")
                    .select("eleve_id , eleve(num_eleve, users(nom,prenom) , class(id))")
                    .eq("parent_id", userId);
              
                    const CombinationObjects = data.map(item => ({
                        nom: item.eleve.users.nom,
                        prenom: item.eleve.users.prenom,
                        num_eleve: item.eleve.num_eleve,
                        eleve_id: item.eleve_id,
                        class_id: item.eleve.class.id,
                      }));

                    setChildrens(CombinationObjects);

                } catch (error) {
                  console.error('Parent not found:', error.message);
                }
              }

              getChildrens()
     
    }, [])


    const updateDataNotSeen = async (target) => {
      
      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
    
        let data, error;
    
        if (target === "notes") {
          ({ data, error } = await supabase
            .from("notes")
            .update({ seen: true })
            .eq("seen", false));
        } else if (target === "devoirs") {
          ({ data, error } = await supabase
            .from("devoir")
            .update({ seen: true })
            .eq("seen", false));
        }
    
        if (error) {
          throw error;
        }
    
        if (notifiedPages.includes(target)) {
          setNotifiedPages(prev => prev.filter(page => page !== target));
        }
      } catch (error) {
        console.error('Error updating data:', error.message);
      }
    };



    useEffect(() => {
      const subscribeToNewMessages = async () => {
        try {
          const token = await getToken({ template: 'supabase' });
          const supabase = await supabaseClient(token);
  
          const channel = supabase
            .channel('public:notes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notes' }, payload => {
              const newNote = payload.new;
              if (!notifiedPages.includes("notes")) {
                const isChildInClass = childrens.some(child => child.class_id === newNote.class_id);
                if (isChildInClass) {
                  setNotifiedPages(prev => [...prev, "notes"]);
                }
              }
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'devoir' }, payload => {
              const newDevoir = payload.new;
              if (!notifiedPages.includes("devoirs")) {
                const isChildInClass = childrens.some(child => child.class_id === newDevoir.class_id);
                if (isChildInClass) {
                  setNotifiedPages(prev => [...prev, "devoirs"]);
                }
              }
            })
            .subscribe();
  
          return () => {
            supabase.removeChannel(channel);
          };
        } catch (error) {
          console.error('Error subscribing to real-time messages:', error.message);
        }
      };
  
      subscribeToNewMessages();
    }, [childrens, notifiedPages]);


  return (
    <div className='relative'>

       

        <div style={familyBg}  className='relative p-16 flex items-center  h-[23rem]'>
          {/*  <div className='absolute top-4 right-0 cursor-pointer flex justify-center items-center p-2 px-4 border-gray-500 border-[2px] border-r-0 bg-white bg-opacity-90  rounded-l-full '>
            <Badge  size='sm' className='border-0 text-[8px]' content="5" color="danger" placement="top-right"  >
                <IoNotifications className='text-gray-500 text-[18px]' />
            </Badge>
                 
            </div> */}
            <div className='flex flex-col gap-4 text-white w-[30%] '>
            <h2 className="text-[32px] font-bold text-gray-100 ">Salut MR.{userId && parent.nom} {userId && parent.prenom} </h2>
  <p className="text-sm  leading-relaxed tracking-wider text-gray-300">
    Bienvenue dans l'espace parents. Ici vous pourrez suivre les activités, les devoirs et la présence de vos enfants.
  </p>
  
            </div>

            
            
        </div>


        <Email />

        <div className='p-10 pt-6 flex flex-col gap-3'>

            <h2 className='font-bold text-2xl ml-1' >Vos enfants </h2>
            <Chip size='sm' color='warning'  variant='flat'>Vous pouvez facilement copier le numéro d'identification de votre enfant et l'utiliser pour rechercher ses informations</Chip>

            <ul className='flex flex-wrap gap-2'>
            {childrens.map((child , index) => (
                <li key={index} className='flex min-w-[370px] gap-2 items-center justify-between p-2 pl-4 text-[14px] font-semibold rounded-full bg-grayBg border-[1.5px]'>
                <p>{child.nom}</p> 
                <p>{child.prenom}</p>/
                <span className='flex items-center text-[12px]'>Numéro d'enfant :
                <Snippet
                    size='sm'
                    className='rounded-full ml-2 z-0'
                    tooltipProps={{
                        color: "foreground",
                        content: "Copy this snippet",
                        disableAnimation: true,
                        placement: "right",
                        closeDelay: 0
                    }}
                    >{child.num_eleve}
                    </Snippet>
                    </span>
                  
                </li>
            ))}
            </ul>

            <div className='flex flex-col justify-center'>

            <Tabs  onClick={scrollToRef} ref={tabref} aria-label="Options" className='mt-4 self-center'>
            <Tab   key="records" title="Enregistrements">
                <ChildInfo getToken={getToken} />
          
        </Tab>

        <Tab    key="notes" title={
              <div onClick={() => updateDataNotSeen("notes")} className='flex gap-2 items-center'>
                Les notes
                {notifiedPages.includes("notes") && (
                  <span className=' w-2 h-2 rounded-full bg-red-500'></span>
                )}
              </div>
            }>
          <Notes childrens={childrens} notifiedPages={notifiedPages}  getToken={getToken} />
          
        </Tab>
        <Tab  key="photos" title={
              <div onClick={() => updateDataNotSeen("devoirs")} className='flex gap-2 items-center'>
                Les devoirs
                {notifiedPages.includes("devoirs") && (
                  <span className=' w-2 h-2 rounded-full bg-red-500'></span>
                )}
              </div>
            }>
        <FatchDevoir notifiedPages={notifiedPages} childrens={childrens}  userId={userId} getToken={getToken} />
          
        </Tab>
        </Tabs>
        </div>

         </div>

         <div className='fixed bottom-4 right-4 '>
        <div>
        <ChatList userId={userId} setMessages_sent={setMessages_sent} getToken={getToken} childrens={childrens} showChatList={showChatList} />

      

          </div>
          <Badge size="sm" className={`${(showChatList || !messages_sent) && "opacity-0"} z-50 border-0 top-2`}  content={""} color="danger" shape="rectangle">
          <div onClick={() => setShowChatList((prev) => !prev)} style={{boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}} className='z-50 bg-grayBg ease-linear duration-100 cursor-pointer hover:scale-105 flex items-center justify-center text-2xl  w-[3rem] h-[3rem] border text-default-600 rounded-full' >
              {showChatList ? <IoClose /> : <AiFillMessage  />} 
        </div>
        </Badge>

        

        </div>


       {/*  <div className='fixed   w-[10rem] right-[12rem] bottom-0  rounded-t-xl'>
        <div className='w-full flex text-[12px] p-2 gap-6 bg-primaryColor text-white  items-center justify-between    rounded-t-xl'>
            
            
            fdfzfefe

            <div className='flex  items-center'>
            <FaMinus className='text-[12px]' />
              <IoIosClose className='text-[20px]' /> 
            </div>

            </div>

            </div>    */}
    </div> 
  )
}

export default page