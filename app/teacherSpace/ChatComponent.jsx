"use client"
import React, { useState, useEffect, useRef  , useLayoutEffect} from 'react';
import { supabaseClient } from '@/app/utils/supabaseClient';
import { IoSend } from "react-icons/io5";
import { useAuth } from '@clerk/nextjs';


const ChatComponent = ({ teacher_id ,openChats ,messages_teacher }) => {

    const { userId, getToken } = useAuth();



    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const containerRef = useRef(null);


    const scrollToBottom = () => {
        if (containerRef.current) {

            containerRef.current.scrollTop = containerRef.current.scrollHeight; 
        }
    };

    useLayoutEffect(() => {
        scrollToBottom();
    }, [messages]);




    useEffect(() => {
        const markMessagesAsSeen = async () => {
          try {
            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
    
            // Update the messages to set seen to true
            for (const message of messages_teacher) {
                await supabase
                  .from('chat_messages')
                  .update({ seen: true })
                  .eq('id', message.id);
              }
    
    
            // Optionally, you can update the state or perform any other action
            // setMessages_sent(data);
          } catch (error) {
            console.error('Error marking messages as seen:', error.message);
          }
        };

    
        // Call the function to mark messages as seen when component mounts
        openChats[teacher_id] && markMessagesAsSeen();
      }, [openChats[teacher_id] , messages_teacher] );
    
  
    
    
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = await getToken({ template: 'supabase' });
                const supabase = await supabaseClient(token);
                const { data, error } = await supabase
                    .from('chat_messages')
                    .select('*')
                    .or(`and(receiver_id.eq.${teacher_id},sender_id.eq.${userId}),and(receiver_id.eq.${userId},sender_id.eq.${teacher_id})`)
                    .order('created_at', { ascending: false }) // Fetch messages in descending order
                    .limit(5);

                if (error) {
                    throw error;
                }

                // Update: Reverse the order of fetched messages before setting state
                setMessages(data.reverse() || []);
                // Scroll to the bottom after initial messages are loaded
                
            } catch (error) {
                console.error('Error fetching messages:', error.message);
            }
        };

        fetchMessages();
    }, [teacher_id, getToken]);


    useEffect(() => {
        const subscribeToNewMessages = async () => {
            try {
                const token = await getToken({ template: 'supabase' });
                const supabase = await supabaseClient(token);

                    const channel = supabase
                    .channel('public:chat_messages')
                    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, payload => {
                      
                            const newMessage = payload.new;

                         /*    if (newMessage.sender_id === teacher_id){
                                setTeachers(prevTeachers => {
                                    return prevTeachers.map(teacher => {
                                        if (teacher.ensg_id === teacher_id) {
                                            return { ...teacher, msgState: true };
                                        }
                                        return teacher;
                                    });
                            })} */

                            

                            const isRelevantMessage = 
                                (newMessage.receiver_id === teacher_id && newMessage.sender_id === userId) ||
                                (newMessage.receiver_id === userId && newMessage.sender_id === teacher_id);
                            if (isRelevantMessage) {
                                setMessages(prevMessages => {
                                    // Check for duplicate messages
                                    const messageExists = prevMessages.some(message => message.id === newMessage.id);
                                    if (!messageExists) {
                                        return [...prevMessages, newMessage];
                                    }
                                    return prevMessages;
                                });
                                
                                
                            }
                        
                    })
                    .subscribe();

            } catch (error) {
                console.error('Error subscribing to real-time messages:', error.message);
            }
        };

    

        subscribeToNewMessages();
        
    }, []);



    const sendMessage = async () => {
        try {
            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
            const { data, error } = await supabase
                .from('chat_messages')
                .insert([{ sender_id: userId, receiver_id: teacher_id, message: inputValue }]);

            if (error) {
                throw error;
            }

            // Update: Add new message at the end of the array
      /*       setMessages([...messages, inputValue]); */
            setInputValue('');
            // Scroll to the bottom after sending a message
            
        } catch (error) {
            console.error('Error sending message:', error.message);
        }
    };

    const handleScroll = async () => {
        const container = containerRef.current;
        if (container.scrollTop === 0 && !isLoading && hasMore) {
            setIsLoading(true);
            const previousScrollHeight = container.scrollHeight;
            try {
                const token = await getToken({ template: 'supabase' });
                const supabase = await supabaseClient(token);
                const { data, error } = await supabase
                    .from('chat_messages')
                    .select('*')
                    .eq('receiver_id', teacher_id)
                    .order('created_at', { ascending: false }) // Fetch messages in descending order
                    .range(messages.length, messages.length + 4);

                if (error) {
                    throw error;
                }

                if (data.length === 0) {
                    setHasMore(false);
                }

                // Update: Concatenate new messages at the beginning of the existing messages
                setMessages([...data.reverse(), ...messages]);

                // Restore the scroll position
                setTimeout(() => {
                    container.scrollTop = container.scrollHeight - previousScrollHeight;
                }, 0);
            } catch (error) {
                console.error('Error fetching more messages:', error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div  className='bg-grayBg rounded-lg mt-2 border p-2 w-[20rem]' style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <div className='max-h-[6rem] flex flex-col mb-2 overflow-auto' ref={containerRef} onScroll={handleScroll}>
                {messages.map((message, index) => (
                    <p className={`${userId === message.sender_id ? "bg-green-100" : "bg-red-100 self-end mr-2"} p-1 px-2 mt-1 text-wrap rounded-full border w-fit`} key={index}>{message.message}</p>
                ))}
                {isLoading && <div>Loading...</div>}
            </div>
            <div className='flex items-center gap-2'>
                <textarea
                    
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className='flex-1 resize-none rounded-md outline-none border p-1'
                    type="text"
                />
                <IoSend
                    onClick={sendMessage}
                    
                    className='cursor-pointer text-primaryColor'
                />
            </div>
        </div>
    );
};

export default ChatComponent;