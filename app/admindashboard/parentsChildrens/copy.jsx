"use client"
import React, { useEffect, useState } from 'react'
import {Select, SelectItem , Button} from "@nextui-org/react";
import { supabaseClient } from "@/app/utils/supabaseClient"
import { useAuth } from '@clerk/nextjs';


const page = () => {

    const { getToken } = useAuth();


    const [selectedParent, setSelectedParent] = useState('');
    const [selectedChild, setSelectedChild] = useState('');
    
    const [parents, setParents] = useState([]);
    const [childrens , setChildrens] = useState([]);

    useEffect(() => {
        
        const fetchParent = async()=> {

            const token = await getToken({ template: "supabase" });
            const supabase = await supabaseClient(token);
            const { data:fetchedParents, error:errorfetchedParents } = await supabase
            .from('users')
            .select('*')
            .eq("role","Parent")

            setParents(fetchedParents);

            const { data:fetchedChild, error:errorfetchedChild } = await supabase
            .from('users')
            .select('*')
            .eq("role","Student")
            
            setChildrens(fetchedChild);

           /*  const { data, error } = await supabase
            .from('users')
            .select(`
              user_id,
              parent (
                user_id
              )
            `) */

        }

        fetchParent()
    }, [])

    const familybond = async()=> {

        const token = await getToken({ template: "supabase" });
        const supabase = await supabaseClient(token);

        const { error } = await supabase
        .from('eleve')
        .update({parent:selectedParent})
        .eq('user_id',selectedChild)

    }

  return (
    <div className="flex-1 p-8 flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Connect Parent with Child</h2>

        <div className='flex items-center gap-3'>
    
        <Select 
         radius ="lg"
         size='sm'
        label="Select an Parent" 
        className="max-w-xs" 
      >
        {parents.map((parent , index) => (
          <SelectItem className="whitespace-nowrap" onClick={() => setSelectedParent(parent.user_id)} key={index} value={selectedParent}>
            {`${parent.nom} ${parent.prenom}`}
          </SelectItem>
        ))}
      </Select>

      <Select 
         radius ="lg"
         size='sm'
        label="Select an child" 
        className="max-w-xs" 
      >
        {childrens.map((child , index) => (
          <SelectItem className="whitespace-nowrap" onClick={() => setSelectedChild(child.user_id)} key={index} value={selectedChild}>
            {`${child.nom} ${child.prenom}`}
          </SelectItem>
        ))}
      </Select>

      <Button onClick={familybond} className='bg-primaryColor text-white'>Family Bond</Button>
      </div>

    </div>
  )
}

export default page