"use clinet"
import React, { useState, useEffect } from 'react';
import { Select, SelectItem, Button, Input  } from '@nextui-org/react';
import { supabaseClient } from '@/app/utils/supabaseClient';
import { Image ,Space} from "antd";
import { GoDownload } from "react-icons/go";
import { AiOutlineSwap } from "react-icons/ai";
import { AiOutlineRotateLeft } from "react-icons/ai";
import { AiOutlineRotateRight } from "react-icons/ai";
import { FiZoomOut } from "react-icons/fi";
import { LuZoomIn } from "react-icons/lu";
import FetchReleves from './FetchReleves';

const FetchTimetable = ({getToken , num_student}) => {

   
    const [timetable, setTimetable] = useState('');

    const getTimetable = async() => {

      if (num_student !== "" ) {

      try {

        const token = await getToken({ template: 'supabase' });
          const supabase = await supabaseClient(token);
          const { data, error } = await supabase
          .from("eleve")
          .select("num_eleve , class(emplois_du_temps , id)")
          .eq('num_eleve', num_student);



          setTimetable(data[0].class.emplois_du_temps);
        
      } catch (error) {
        console.error('Error fetch timetable:', error.message);
      }

    }
    };


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

      
      <div className='flex flex-col  items-center gap-4 border-b p-6 '>
        <Button size='sm'  onClick={() => getTimetable(num_student)} className='bg-primaryColor text-white w-fit'>
          Obtenir emplois du temps
        </Button>

         {timetable !=="" && <Image
          src={timetable}
          width={200}
          preview={{
            toolbarRender: (
              _,
              {
                transform: { scale },
                actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
              },
            ) => (
              <Space size={16} className="toolbar-wrapper bg-black bg-opacity-40 p-4 rounded-full">
                <GoDownload className='cursor-pointer' onClick={() => onDownload(timetable)} />
                <AiOutlineSwap className='transform rotate-90 cursor-pointer' onClick={onFlipY} />
                <AiOutlineSwap className='cursor-pointer'   onClick={onFlipX} />
                <AiOutlineRotateLeft className='cursor-pointer' onClick={onRotateLeft} />
                <AiOutlineRotateRight className='cursor-pointer' onClick={onRotateRight} />
                <FiZoomOut className='cursor-pointer' disabled={scale === 1} onClick={onZoomOut} />
                <LuZoomIn className='cursor-pointer' disabled={scale === 50} onClick={onZoomIn} />
              </Space>
            ),
          }}
        />
} </div>

  )
}

export default FetchTimetable