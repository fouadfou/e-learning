"use state"
import React , {useEffect, useState} from 'react';
import { supabaseClient } from '../utils/supabaseClient';
import { Button } from '@nextui-org/react';

import { Image ,Space} from "antd";
import { GoDownload } from "react-icons/go";
import { AiOutlineSwap } from "react-icons/ai";
import { AiOutlineRotateLeft } from "react-icons/ai";
import { AiOutlineRotateRight } from "react-icons/ai";
import { FiZoomOut } from "react-icons/fi";
import { LuZoomIn } from "react-icons/lu";


const Notes = ({getToken , childrens ,notifiedPages}) => {


    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
          const notesArray = [];
    
          for (const child of childrens) {
            try {
              const token = await getToken({ template: 'supabase' });
              const supabase = await supabaseClient(token);
              
              // Fetch notes based on class_id
              const { data, error } = await supabase
                .from('notes')
                .select("*,class(class_name),ensg(user_id, users (nom, prenom))")
                .eq('class_id', child.class_id)
                .order('created_at', { ascending: false });
    
              if (error) {
                throw error;
              }
    
              const formattedData = data.map(item => ({
                title: item.title,
                description: item.description,
                ensg_nom: item.ensg.users.nom,
                ensg_prenom: item.ensg.users.prenom,
                src: item.src,
                class_name: item.class.class_name,
                child_nom: child.nom,
                child_prenom: child.prenom,
                eleve_id: child.eleve_id
              }));
    
              notesArray.push(...formattedData);
            } catch (error) {
              console.error('Error fetching notes:', error.message);
            }
          }
    
          setNotes(notesArray);
        };
    
        fetchNotes();
      }, [childrens, getToken ,notifiedPages]);

      const onDownload = (src) => {
        fetch(src)
          .then((response) => response.blob())
          .then((blob) => {
            const url = URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.download = 'image.png';
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(url);
            link.remove();
          });
      };


  return (
    
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {notes.map((note, index) => (
          <li key={index} className="bg-white shadow-md rounded-lg p-4 border text-sm flex flex-col justify-between">
            <div className='flex flex-col gap-2'>
              <h3 className="font-semibold text-xl mb-1">{note.title}</h3>
              <p className="text-gray-700 ">{note.description}</p>
              <p className="text-gray-600 "><strong>Class:</strong> {note.class_name}</p>
              <p className="text-gray-600 "><strong>Enseignant:</strong> {note.ensg_nom} {note.ensg_prenom}</p>

              
              {note.src && (
                <div className="mb-4 h-[6rem] overflow-hidden items-center flex justify-center bg-grayBg rounded-lg">
                  <Image
                    src={note.src}
                    alt={note.title}
                    width={100}
                    className="h-fit rounded-md"
                    preview={{
                      toolbarRender: (
                        _,
                        {
                          transform: { scale },
                          actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
                        },
                      ) => (
                        <Space size={16} className="toolbar-wrapper bg-black bg-opacity-40 p-4 rounded-full">
                          <GoDownload className='cursor-pointer' onClick={() => onDownload(note.src)} />
                          <AiOutlineSwap className='transform rotate-90 cursor-pointer' onClick={onFlipY} />
                          <AiOutlineSwap className='cursor-pointer' onClick={onFlipX} />
                          <AiOutlineRotateLeft className='cursor-pointer' onClick={onRotateLeft} />
                          <AiOutlineRotateRight className='cursor-pointer' onClick={onRotateRight} />
                          <FiZoomOut className='cursor-pointer' disabled={scale === 1} onClick={onZoomOut} />
                          <LuZoomIn className='cursor-pointer' disabled={scale === 50} onClick={onZoomIn} />
                        </Space>
                      ),
                    }}
                  />
                </div>
              )}
            </div>
             <p className='bg-primaryColor text-white w-full rounded-lg p-2 text-center'> {note.child_nom} {note.child_prenom}</p>
          </li>
        ))}
      </ul>
      
 
  )
}

export default Notes