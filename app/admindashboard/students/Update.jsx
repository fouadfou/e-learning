"use client"
import React , { useState , useEffect}from 'react'
import {motion} from "framer-motion"
import { Button, Input, Select, SelectItem  , Snippet } from '@nextui-org/react';
import { supabaseClient } from '@/app/utils/supabaseClient';
import { IoClose } from "react-icons/io5";

const update = ({user_id,getToken ,fetchStudents ,setVisible }) => {

  const [classes , setClasses] = useState([]);
  const [newClass , setNewClass] = useState('');

  useEffect(() => {

    const fetchClasses = async () => {
        try {
          // Fetch all classes from Supabase
          const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
            const { data, error } = await supabase
                .from('class')
                .select('id,class_name,niveaux(niveau)')
               
        
                const formattedData = data.map(item => ({
                    class_id:item.id,
                    class_name: item.class_name,
                    niveau: item.niveaux.niveau
                  }));
                
                  
    
    
                  const sortedClasses = [...formattedData].sort((a, b) => {
                    const niveauA = parseInt(a.niveau.split(' ')[1]);
                    const niveauB = parseInt(b.niveau.split(' ')[1]);
                    return niveauA - niveauB;
                  });
                  setClasses(sortedClasses);
          
        } catch (error) {
          console.error('Error fetching classes:', error.message);
        }
      };
    
      fetchClasses();
  }, [ getToken])
   



  const updateClass = async (user_id) => {
    

    console.log("user_id", user_id)
    console.log("newclas", newClass)

    if (user_id && newClass !== "") {
      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
          .from("eleve")
          .update({ class: newClass.id })
          .eq("user_id", user_id);

        if (error) {
          throw error;
        }

        setNewClass('');
        setVisible(false); 
        fetchStudents(); 
      } catch (error) {
        console.error('Error updating class:', error.message);
      }
    }
  }

  return (
     <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
    transition={{duration:0.2  , ease:"linear"}} className='z-50 fixed bg-black bg-opacity-40  top-0 left-0 w-screen h-screen'>
              
              <div  className='bg-white w-[50%] flex flex-col gap-4 p-6 pt-10 rounded-xl h-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <IoClose onClick={() => setVisible(false)} className='absolute top-3 right-3 cursor-pointer' />
                <Select
radius="lg"
size="sm"
label="Sélectionnez une classe"
className="w-full"
>
{classes.map((classe, index) => (
  <SelectItem
    value={newClass.class_id}
    className="whitespace-nowrap "
    onClick={() => setNewClass({id:classe.class_id , class_name:classe.class_name})}
    key={index}
    textValue={newClass.class_name || ''}
  >
    {classe.class_name} 
  </SelectItem>
))}
</Select>
                <Button onClick={() => updateClass(user_id)}  className='bg-primaryColor text-white'>Sauvegarder</Button>

              </div>
    </motion.div>
  )
}

export default update