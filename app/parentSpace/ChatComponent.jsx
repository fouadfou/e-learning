"use client"
import React, { useState, useEffect, useRef } from 'react';
import { supabaseClient } from '@/app/utils/supabaseClient';
import { IoSend } from "react-icons/io5";
import { useAuth } from '@clerk/nextjs';

const ChatComponent = ({ teacher_id }) => {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { userId, getToken } = useAuth();
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = await getToken({ template: 'supabase' });
                const supabase = await supabaseClient(token);
                const { data, error } = await supabase
                    .from('chat_messages')
                    .select('*')
                    .eq('receiver_id', teacher_id)
                    .order('created_at', { ascending: false }) // Fetch messages in descending order
                    .limit(5);

                if (error) {
                    throw error;
                }

                // Update: Reverse the order of fetched messages before setting state
                setMessages(data.reverse() || []);
            } catch (error) {
                console.error('Error fetching messages:', error.message);
            }
        };

        fetchMessages();
    }, [teacher_id, getToken]);

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
            setMessages([...messages, data[0]]);
            setInputValue('');
        } catch (error) {
            console.error('Error sending message:', error.message);
        }
    };

    const handleScroll = async () => {
        const container = containerRef.current;
        if (container.scrollTop === 0 && !isLoading && hasMore) {
            setIsLoading(true);
            try {
                const token = await getToken({ template: 'supabase' });
                const supabase = await supabaseClient(token);
                const { data, error } = await supabase
                    .from('chat_messages')
                    .select('*')
                    .eq('receiver_id', teacher_id)
                    .order('created_at', { ascending: false }) // Fetch messages in ascending order
                    .range(messages.length, messages.length + 4);

                    console.log("data",data)

                if (error) {
                    throw error;
                }

                if (data.length === 0) {
                    setHasMore(false);
                }

                // Update: Concatenate new messages at the beginning of the existing messages
                setMessages([...data.reverse(), ...messages]);
            } catch (error) {
                console.error('Error fetching more messages:', error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className='bg-grayBg rounded-lg mt-2 border p-2 w-[20rem]' style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <div className='max-h-[6rem]  mb-2 overflow-auto' ref={containerRef} onScroll={handleScroll}>
                {/* Update: Reverse the order of messages when rendering */}
                {messages.map((message, index) => (
                    <div key={index}>{message.message}</div>
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
