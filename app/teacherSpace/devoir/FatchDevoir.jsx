import React, { useState , useEffect } from 'react';
import { supabaseClient } from '@/app/utils/supabaseClient';
import {  Button } from '@nextui-org/react';
import { FiEdit } from "react-icons/fi";



const FatchDevoir = ({fetchHomeWork ,userId ,getToken}) => {

    const [HomeWorks , setHomeWorks] = useState([]);
    

    const getHomeworks = async () => {
        try {
          const token = await getToken({ template: 'supabase' });
          const supabase = await supabaseClient(token);
          const { data, error } = await supabase
            .from('devoir')
            .select('*,matiere(matiere_name) , class(class_name)')
            .eq('ensg_id', userId)
            .order('created_at', { ascending: false });


    
          if (error) {
            throw error;
          }
    
     /*      const filteredHomeWorks = data.filter(homework => homework.matiere_ensg !== null);
    
          const devoirsWithNestedInfo = filteredHomeWorks.map(({ matiere_ensg, ...devoir }) => ({
            ...devoir,
            matiere_name: matiere_ensg.matiere.matiere_name,
            class_name: matiere_ensg.class.class_name,
          }));
     */
          setHomeWorks(data);
        } catch (error) {
          console.error('Error fetching homeworks:', error.message);
        }
      };
    

    useEffect(() => {
       
        getHomeworks();
      }, [fetchHomeWork]);

    const  deleteHomeWork = async (id)=> {

      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
          .from('devoir')
          .delete()
          .eq("id",id)

          setHomeWorks((prevHomeWorks) =>
            prevHomeWorks.filter((homeWork) => homeWork.id !== id)
          );

  
      } catch (error) {
        console.error('Error fetching homeworks:', error.message);
      }

    }


    return (
        <div className='border-t   py-6 '>
            <h2 className='font-medium mb-3'>Tous les devoirs</h2>

            
                <ul className='grid grid-cols-cards gap-4'>
                    {HomeWorks.map((homework , index) => (
                        <li style={{boxShadow:"rgba(99, 99, 99, 0.15) 0px 2px 8px 0px"}}  className=" bg-grayBg border flex flex-col gap-2  p-5 text-[13px] rounded-lg " key={index}>

                           <h2 className='font-semibold text-[16px]'> {homework.title} de "{homework.matiere.matiere_name}" / Class : {homework.class.class_name}</h2>
                           <p> {homework.description}</p>
                           <div className='flex gap-4 mb-3'>
                            <p><span className='font-medium text-green-600'>Date début :</span> {homework.date_debut}</p>
                            /
                            <p><span className='font-medium text-danger-600'>Date fin :</span> {homework.date_fin}</p>

                           </div>
                           <div className='flex gap-3 text-[12px]'>
                           <button onClick={()=>deleteHomeWork(homework.id)}  className='flex-1 p-2 rounded-lg bg-[#F9494B] text-white'>Delete HomeWork</button>
                           <button className=' hover:bg-gray-200 duration-200 p-2 px-3 rounded-lg bg-grayBg border-[1.5px] '> <FiEdit /></button>
                           </div>
                        </li>
                    ))}
                </ul>
            </div>
       
    );
}

export default FatchDevoir;
