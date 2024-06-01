"use client"
import React, { useState, useEffect } from 'react'
import { Button, Textarea, Select, SelectItem , Input } from "@nextui-org/react"
import { useAuth } from '@clerk/nextjs'
import { supabaseClient } from '@/app/utils/supabaseClient';
import {  Image, Upload  } from 'antd';
import FetchNotes from './FetchNotes';




const Page = () => {

  const { userId, getToken } = useAuth()

  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [title , setTitle] = useState('');
  const [description , setDescription] = useState('');
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [click , setClick] = useState(false);


  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = await getToken({ template: 'supabase' })
        const supabase = await supabaseClient(token)

        // Fetch all classes from Supabase
        const { data, error } = await supabase
          .from('class')
          .select('id, class_name, niveaux(niveau)')

        if (error) {
          console.error('Error fetching classes:', error.message)
          return
        }

        const formattedData = data.map(item => ({
          class_id: item.id,
          class_name: item.class_name,
          niveau: item.niveaux.niveau
        }))

        const sortedClasses = [...formattedData].sort((a, b) => {
          const niveauA = parseInt(a.niveau.split(' ')[1])
          const niveauB = parseInt(b.niveau.split(' ')[1])
          return niveauA - niveauB
        })

        setClasses(sortedClasses)
      } catch (error) {
        console.error('Error fetching classes:', error)
      }
    }

    fetchClasses()
  }, [getToken])


  const handleChange = async (info) => {

   

    let fileList = [...info.fileList];

    // 1. Limit the number of uploaded images to 1
    fileList = fileList.slice(-1);

    // 2. Read from response and show file preview
    fileList = await Promise.all(
      fileList.map(async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        return file;
      })
    );

    setFileList(fileList);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });



    const handleUpload = async () => {

  
      const file = fileList[0];

      if (!file || title ===""  || selectedClass ===""  )
        {
          return;} 
    
      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
      
            // Insert a new note
            const { data: noteData, error: noteError } = await supabase
              .from('notes')
              .insert(
                {
                  title:title,
                  description: description,
                  class_id: selectedClass.id,
                  ensg_id:userId,
                }
              )
            
      
            if (noteError) {
              throw noteError
            }

        // Upload the image to Supabase Storage
        const { data: imageData, error: uploadError } = await supabase.storage
          .from('emplois_du_temps')
          .upload(`public/${file.name}`, file.originFileObj);
    
        if (uploadError) {
          throw uploadError;
        }
    
        // Get the public URL of the uploaded image
        const { data: imageUrl, error: urlError } = await supabase.storage
          .from('emplois_du_temps')
          .getPublicUrl(imageData.path);
    
        if (urlError) {
          throw urlError;
        }

        const { data:lastNote, error } = await supabase
        .from('notes')
        .select('*')
        .order('id', { ascending: false })
        .limit(1);

       

         // Update the 'emplois_du_temps' column in the 'class' table with the image URL
         const { error: errEmp } = await supabase
         .from('notes')
         .update({ src: imageUrl.publicUrl.toString() })
         .eq("id", lastNote[0].id);

         setClick(!click)
       // Reset state
        setTitle('');
        setDescription('');
        setSelectedClass('');
        setFileList([]);
        setPreviewImage('');
      

      } catch (error) {
       
        console.error('Error uploading image:', error.message);
      }
    };



  return (

    <div>
       
    <div className='flex flex-wrap  gap-4'>

        <Input textValue={title} onBlur={(e) => setTitle(e.target.value)} radius='lg' className='w-fit' type="text" size="sm" label="Entrez le titre" />

        <Select
        radius="lg"
        size="sm"
        label="Sélectionnez une classe"
        className="max-w-xs"
        
      >
        {classes.map((classe, index) => (
          <SelectItem
            key={index}
            value={classe.class_id} // Corrected value attribute
            className="whitespace-nowrap"
            textValue={`${classe.class_name} / ${classe.niveau}`}
            onClick={() => setSelectedClass({class_name: classe.class_name,id:classe.class_id})}
          >
            {classe.class_name} / {classe.niveau}
          </SelectItem>
        ))}
      </Select>

      
      <Textarea
        label="Description"
        placeholder="Entrez votre description"
        className="w-[50%]"
        onBlur={(e) => setDescription(e.target.value)}
        textValue={description}
      />

    

      <Upload
              action=""
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              onPreview={handlePreview}
              beforeUpload={() => false} // Disable default upload behavior
            >
              {fileList.length === 0 && '+ Upload'}
            </Upload>
            <Image
              preview={{
                visible: !!previewImage,
                onVisibleChange: (visible) => {
                  if (!visible) setPreviewImage('');
                },
              }}
              src={previewImage}
              style={{ display: 'none' }}
            />

    </div>
    

    <Button onClick={handleUpload} className='bg-primaryColor w-[50%] flex-1 flex-shrink-0 basis-auto text-white  mt-6'>Ajouter</Button>


    <FetchNotes click={click} />

    </div>
  )
}

export default Page
