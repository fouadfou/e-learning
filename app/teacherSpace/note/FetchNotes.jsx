"use client"
import React, { useState, useEffect } from 'react'
import { Button } from "@nextui-org/react"
import { supabaseClient } from '@/app/utils/supabaseClient';
import { useAuth } from '@clerk/nextjs'
import {Image} from "antd"
import { FiEdit } from "react-icons/fi";




const FetchNotes = ({click }) => {

    const { userId, getToken } = useAuth()

  const [notes, setNotes] = useState([]);



    useEffect(() => {

      
    const fetchNotes  = async () => {

      try {
          
          const token = await getToken({ template: 'supabase' })
          const supabase = await supabaseClient(token)

          // Fetch all classes from Supabase
          const { data, error } = await supabase
          .from('notes')
          .select('* , class(class_name)')
          .eq('ensg_id ', userId)
          .order('created_at', { ascending: false });


          setNotes(data)

      } catch (error) {
    console.error('Error fetching notes:', error.message)
          
      }
  }


        fetchNotes();
      
    }, [click])

    
    const deletNote=  async(note_id) => {

      try {

        const token = await getToken({ template: 'supabase' })
        const supabase = await supabaseClient(token)

        // Fetch all classes from Supabase
        const { data, error } = await supabase
        .from('notes')
        .delete()
        .eq("id",note_id)
        .order('created_at', { ascending: false });
        
        
        setNotes(prevNotes => prevNotes.filter(note => note.id !== note_id));
        
      } catch (error) {
        console.error('Error deleting note:', error.message)
      }

    }
    
    
  return (
    <div className="container mx-auto px-4 py-8">
       
      <h1 className="text-2xl font-bold mb-6">Notes</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {notes.map((note, index) => (
          <li key={index} className="bg-white shadow-md rounded-lg p-6 border flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-xl mb-2">{note.title}</h3>
              <p className="text-gray-700 mb-4">{note.description}</p>
              <p className="text-gray-600 mb-4"><strong>Class:</strong> {note.class?.class_name}</p>
              {note.src && (
                <div className="mb-4 h-[6rem] overflow-hidden items-center flex justify-center bg-grayBg rounded-lg">
                  <Image src={note.src} alt={note.title} width={100} className="h-fit rounded-md" />
                </div>
              )}
            </div>

            <div className='flex items-center  mt-2 gap-2'>
                
                <Button onClick={() => deletNote(note.id)} className="bg-red-500 text-white flex-1">Supprimer</Button>
                <Button isIconOnly className='bg-grayBg border'><FiEdit /></Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FetchNotes