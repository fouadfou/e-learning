"use state"
import React , {useEffect, useState} from 'react'
import {AnimatePresence, motion } from 'framer-motion'
import { supabaseClient } from '../utils/supabaseClient'
import { AiFillMessage } from "react-icons/ai";
import ChatComponent from './ChatComponent';
import { Button , Card ,CardBody} from '@nextui-org/react';
import { IoPersonAddSharp } from "react-icons/io5";


const ChatList = ({showChatList , getToken , userId , setMessages_sent}) => {

    const [teachers , setTeachers] = useState([]);
    const [openChats, setOpenChats] = useState({});
    const [msgNotseen , setMsgNotseen] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [teacherResults, setTeacherResults] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [sender , setSender] = useState('');



     /////////////////// fetch all parents /////////////////////////

     useEffect(() => {
        const fetchTeacher = async() => {
        try {
          const token = await getToken({ template: 'supabase' });
          const supabase = await supabaseClient(token);
      
          // Fetch unseen messages
          const { data, error } = await supabase
          .from("users")
          .select("user_id,nom,prenom")
          .eq("role", "Parent")

          setTeacherResults(data)

        } catch (error) {
          
        }
      }
      fetchTeacher();
      }, [getToken])


       /////////////////// add chaters to parent state /////////////////////////

       useEffect(() => {
        const fetchChatters = async () => {
            try {
                const token = await getToken({ template: 'supabase' });
                const supabase = await supabaseClient(token);

                // Fetch chatters from the database
                const { data, error } = await supabase
                    .from("ensg")
                    .select("chatters")
                    .eq("user_id" , userId)
                    .single();

                if (error) {
                    console.error("Error fetching chatters:", error);
                    return;
                }

                const chatters = JSON.parse(data.chatters);
             


                // Filter chatters based on teacherResults
                const filteredTeachers = teacherResults.filter(teacher =>
                  chatters.some(chatter => teacher.user_id === chatter)
              );

                setTeachers(filteredTeachers);
            } catch (error) {
                console.error("Error:", error);
            }
        };

       (teacherResults.length > 0 && setMessages_sent ) && fetchChatters();
    }, [getToken, teacherResults]);


      /////////////////// add messages not seen /////////////////////////

      useEffect(() => {

        const getMsgNotseen = async () => {
          try {
            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
        
            // Fetch unseen messages
            const { data, error } = await supabase
              .from("chat_messages")
              .select("id, sender_id")
              .eq("receiver_id", userId)
              .eq("seen", false);
        
            if (error) {
              throw error;
            }
        
            // Update state with unseen messages
            setMsgNotseen(data);
          } catch (error) {
            console.error('Error fetching unseen messages:', error.message);
          }
        };
        getMsgNotseen();
        
      }, [showChatList , userId])



      const toggleChat = (teacherId) => {
        setOpenChats((prevOpenChats) => ({
            ...prevOpenChats,
            [teacherId]: !prevOpenChats[teacherId]
        }));
    }; 

 /////////////////// real time update and insert /////////////////////////

 useEffect(() => {
    const subscribeToNewMessages = async () => {
      try {
          const token = await getToken({ template: 'supabase' });
          const supabase = await supabaseClient(token);

              const channel = supabase
              .channel('public:chat_messages')
             
              .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_messages' }, payload => {
                const newMessage = payload.new;

                if (payload.new.seen === true){

                setMsgNotseen(prevMessages => prevMessages.filter(message => message.id !== newMessage.id));
              }
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, payload => {
              const newMessage = payload.new;


              if(newMessage.sender_id !== userId && newMessage.receiver_id === userId ) {

              const sender = teacherResults.find(teacher => teacher.user_id === newMessage.sender_id);

               // Add the new message to the msgNotseen state with sender's name
               if (sender) {
                // Add the sender to the teachers state without duplicates
                setTeachers(prevTeachers => {
                    if (!prevTeachers.some(teacher => teacher.user_id === sender.user_id)) {
                        return [...prevTeachers, sender];
                    }
                    return prevTeachers;
                });
              }

            
              setMsgNotseen(prevMessages => {
                if (!prevMessages.some(msg => msg.id === newMessage.id)) {
                    return [...prevMessages, newMessage];
                }
                return prevMessages;
            });
          }
              
          })
            .subscribe();
        }
      catch (error) {
          console.error('Error subscribing to real-time messages:', error.message);
      }
  };

  subscribeToNewMessages();
  
  }, [teacherResults])



  useEffect(() => {
    if (teachers.length === 0) return;

    // Fetch chatters from the database
    const fetchChatters = async () => {
        try {
            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);

            const { data, error } = await supabase
                .from('ensg')
                .select('chatters')
                .eq('user_id', userId) // Assuming userId is defined somewhere in your component
                .single();

            if (error) {
                console.error('Error fetching chatters:', error);
                return;
            }

            const chatters = JSON.parse(data.chatters);
           

      // Add the new teacher ID if it's not already in the array
            

            // Check if the last teacher in teachers is included in chatters and add if not
            const lastTeacher = teachers[teachers.length - 1];
            
              if (!chatters.includes(lastTeacher.user_id)) {
                chatters.push(lastTeacher.user_id);

                const { data: updateData, error: updateError } = await supabase
                .from('ensg')
                .update({ chatters })
                .eq('user_id', userId);
              }

             
        } catch (error) {
            console.error('Error:', error);
        }
    };

    fetchChatters();
}, [teachers]);
  


 /////////////////// unshow notification /////////////////////////

 useEffect(() => {

    msgNotseen.length === 0 ? setMessages_sent(false) : setMessages_sent(true);
  }, [msgNotseen])


  /////////////////// search teacher  /////////////////////////

  const handleInputChange = (value) => {
    setSearchValue(value);

    if (value.trim() === '') {
      setFilteredTeachers([]); // Clear results if input is empty
      return;
    }

    const filtered = teacherResults.filter((teacher) =>
      `${teacher.nom} ${teacher.prenom}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTeachers(filtered);
  };


  /////////////////// add searched teacher to chatters list/////////////////////////

  const addTeacher = async (teacherId , teacher) => {
    setTeachers(prevTeachers => [...prevTeachers, teacher]);
    
    try {
      const token = await getToken({ template: 'supabase' });
      const supabase = await supabaseClient(token);

      // Fetch the current chatters for the parent
      const { data: parentData, error: fetchError } = await supabase
        .from('ensg')
        .select('chatters')
        .eq('user_id', userId)
        .single(); // Assumes parentId uniquely identifies a single row



      if (fetchError) throw fetchError;

      // Parse the current chatters JSON array
      var chatters = JSON.parse(parentData.chatters);


      // Add the new teacher ID if it's not already in the array
      if (!chatters.includes(teacherId)) {
        chatters.push(teacherId);
      }

   
      // Update the chatters column with the new array
      const { data: updateData, error: updateError } = await supabase
        .from('ensg')
        .update({ chatters })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      console.log('Teacher added successfully:', updateData);
    } catch (error) {
      console.error('Error adding teacher to chatters:', error.message);
    }
  };


    

      return (

        <AnimatePresence className="relative z-50">
                {showChatList && (
                    <motion.ul
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        style={{ boxShadow: "rgba(0, 0, 0, 0.10) 0px 3px 4px" }}
                        className="absolute z-50 flex flex-col w-fit overflow-auto max-h-[calc(75vh)] bottom-14 right-0 bg-white rounded-xl border"
                    >
          
                        <h1 className='w-full text-sm bg-[#5A5A5A] text-gray-100 rounded-t-xl p-2 text-center'>Enseignants</h1>
                        <div>
                          <div className='flex p-1 px-2 border-b gap-2'>
                            <input onChange={(e) => handleInputChange(e.target.value)} type="text" className='border rounded-lg placeholder:text-[12px] px-2' placeholder='Recherche par nom' />
                            <Button size="sm" className='button-nextui bg-primaryColor text-white w-fit'>Ajouter</Button>
                          </div>
    
                          <ul>
                          {filteredTeachers.map((teacher , index) => (
                  <li key={index} className='flex text-[13px] p-2 bg-grayBg  justify-between'>
                    {teacher.nom} {teacher.prenom}
                    <IoPersonAddSharp onClick={() => addTeacher(teacher.user_id ,teacher)} className='button-nextui text-primaryColor cursor-pointer' />
                  </li>
                ))}
                          </ul>
                        </div>
                        
                        
    
                        {teachers.map((teacher, index) => (
                            <li className={`${index === teachers.length - 1 && "border-b-0"} flex w-full flex-col items-center text-nowrap text-[13px] border-b p-4`} key={index}>
                                <div className='flex gap-6 items-center w-full justify-between'>
                                    <p className='font-medium'>{teacher.nom} {teacher.prenom}</p>
                                    {(msgNotseen.length > 0 && msgNotseen.some((msg) => msg.sender_id === teacher.user_id)) && (
                      <span className='text-[10px] text-white bg-danger-500 rounded-full w-2 h-2 flex items-center justify-center text-center'></span>
                    )}
                                    <AiFillMessage
                                        className='cursor-pointer hover:scale-110 ease-linear duration-100 text-gray-400 hover:text-gray-800 text-[16px]'
                                        onClick={() => toggleChat(teacher.user_id)}
                                    />
                                </div>
                                {openChats[teacher.user_id] && <ChatComponent openChats={openChats}  messages_teacher={msgNotseen.filter((msg) => msg.sender_id === teacher.user_id)}  setMessages_sent={setMessages_sent} setTeachers={setTeachers} teacher_id={teacher.user_id} />}
                            </li>
                        ))}
                    </motion.ul >
                )}
            </AnimatePresence>
      )
    }
export default ChatList