"use client"
import React, { useState , useEffect} from 'react'
import { Input, Button } from '@nextui-org/react'
import { supabaseClient } from '../utils/supabaseClient';
import { useAuth } from '@clerk/nextjs'
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { motion } from 'framer-motion';

const Email = () => {
    const { userId, getToken } = useAuth();
    const [email, setEmail] = useState('');
    const [fetchedEmail , setFetchedEmail] = useState(null);
    const [emailChange , setEmailChange] = useState(false);
    const [updatedEmail , setUpdatedEmail] = useState('');

    useEffect(() => {
        const fetchEmail = async() => {
            try {
                const token = await getToken({ template: 'supabase' });
                const supabase = await supabaseClient(token);

                const { data, error } = await supabase
                    .from('parent')
                    .select('email')
                    .eq('user_id', userId);

                if (data && data.length > 0) {
                    setFetchedEmail(data[0].email);
                } else {
                    setFetchedEmail('');
                }
                
            } catch (error) {
                console.error('Error Fetching Email:', error.message);
            }
        };

        fetchEmail();
    }, [userId]);

    const addEmail = async (event) => {
        event.preventDefault();

        try {
            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);

            const { data, error } = await supabase
                .from('parent')
                .update({ email: email })
                .eq('user_id', userId);

            if (!error) {
                setFetchedEmail(email);
            }

            setEmail('');
        } catch (error) {
            console.error('Error inserting email:', error.message);
        }
    }

    const updateEmail = async (event) => {
        event.preventDefault();
        try {
            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
    
            const { data, error } = await supabase
                .from('parent')
                .update({ email: updatedEmail })
                .eq('user_id', userId);
            
            if (!error) {
                setFetchedEmail(updatedEmail);
            }
    
            setUpdatedEmail('');
            setEmailChange(false);
        } catch (error) {
            console.error('Error updating email:', error.message);
        }
    }

    const deleteEmail = async () => {
        try {
            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);

            const { data, error } = await supabase
                .from('parent')
                .update({ email: null })
                .eq('user_id', userId);
            
            if (!error) {
                setFetchedEmail('');
            }

            setEmailChange(false);
        } catch (error) {
            console.error('Error deleting email:', error.message);
        }
    }

    return (
        <div className='border rounded-xl p-6 mx-11 flex flex-col gap-4 mt-10'>
            {!fetchedEmail ?
                <p className='font-medium text-red-500'>Attention : Veuillez indiquer votre adresse e-mail si vous souhaitez recevoir des notifications concernant la présence de votre enfant.</p>
                :
                <p className='font-medium text-green-600'>Vous recevrez désormais des notifications concernant la présence de votre enfant.</p>
            }

            <form className='flex flex-wrap gap-4 items-center' onSubmit={addEmail}>
                <Input
                    size='sm'
                    type="email"
                    label="Email"
                    labelPlacement="inside"
                    className='flex-1 max-w-[20rem]'
                    isRequired
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button type='submit' className='bg-primaryColor text-white'>Ajouter un e-mail</Button>
            </form>

            {fetchedEmail &&
                <div className='bg-grayBg w-fit p-3 text-sm  rounded-lg'>
                    <div className='flex gap-0 w-fit items-center'>
                        <p>{fetchedEmail}</p>
                        <Button onClick={() => setEmailChange(!emailChange)} size='sm' isIconOnly className='bg-transparent ml-4'>
                            <FiEdit className='text-gray-600' />
                        </Button>
                        <Button onClick={deleteEmail} size='sm' isIconOnly className='bg-transparent'>
                            <MdDelete className="text-base text-danger-400 cursor-pointer" />
                        </Button>
                    </div>

                    {emailChange &&
                       <motion.form onSubmit={updateEmail} className='flex gap-2 items-center' initial={{height:0 , opacity:0}} animate={{height:'auto' , opacity:1}} 
                       exit={{ height: 0, opacity: 0 }} transition={{duration:0.2 , ease:"linear", type:'spring'}}>
                       <Input
                           size='sm'
                           label="New Email"
                           labelPlacement='inside'
                           type='email'
                           isRequired
                           className='flex-1 max-w-[20rem] h-auto items-center '
                           value={updatedEmail}
                           onChange={(e) => setUpdatedEmail(e.target.value)}
                       />
                       <Button type='submit' size='sm' className='bg-primaryColor text-white w-fit'>Save</Button> 
                   </motion.form>
                    }
                </div>
            }
        </div>
    )
}

export default Email;
