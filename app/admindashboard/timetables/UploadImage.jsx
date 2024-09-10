"use client"
import React ,{useEffect, useState} from 'react'
import {  Image, Upload  } from 'antd';
import { supabaseClient } from '@/app/utils/supabaseClient';
import { useAuth } from '@clerk/nextjs';
import { Select , SelectItem , Button } from '@nextui-org/react';



const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

    const UploadImage = () => {

        const { getToken } = useAuth();


        const [fileList, setFileList] = useState([]);
        const [previewImage, setPreviewImage] = useState('');
        const [classes , setClasses] = useState([]);
        const [selectedClass , setSelectedClass] = useState('');


        useEffect(() => {

            const fetchClasse = async() => {

                try {

                    const token = await getToken({ template: 'supabase' });
                    const supabase = await supabaseClient(token);
        
                    // 3. Upload the image to Supabase Storage
                    const { data, error } = await supabase.
                    from("class")
                    .select("*")


                    data.sort((a, b) => {
                      const regex = /\d+/g; // Regular expression to match all numbers in the class name
                      const aNumbers = a.class_name.match(regex).map(Number);
                      const bNumbers = b.class_name.match(regex).map(Number);
              
                      // Compare the first numbers
                      if (aNumbers[0] !== bNumbers[0]) {
                        return aNumbers[0] - bNumbers[0];
                      }
              
                      // If first numbers are equal, compare the last numbers
                      return aNumbers[aNumbers.length - 1] - bNumbers[bNumbers.length - 1];
                    });
                    setClasses(data)
                    
                } catch (error) {
                        console.error('Error fetching class:', error.message);
                    
                }

            }

            fetchClasse();

        }, [])
        


      
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
            if (!file && selectedClass !== null) return;
          
            try {
              const token = await getToken({ template: 'supabase' });
              const supabase = await supabaseClient(token);
          
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
          
              // Update the 'emplois_du_temps' column in the 'class' table with the image URL
              const { error: errEmp } = await supabase
                .from('class')
                .update({ emplois_du_temps: imageUrl.publicUrl.toString() })
                .eq("id", selectedClass.id);
          
              setSelectedClass('');
              setFileList([]);
              setPreviewImage('');
          
              console.log('Image uploaded successfully:', imageUrl);
            } catch (error) {
              console.error('Error uploading image:', error.message);
            }
          };
        
      
        return (
          <div>

            <div className='flex flex-col gap-4'>
            <Select
  radius="lg"
  size="sm"
  label="Sélectionnez une classe"
  className="max-w-xs"
  value={selectedClass || ''}

>
  {classes.map((classe, index) => (
    <SelectItem
      value={selectedClass}
      className="whitespace-nowrap"
      onClick={() => setSelectedClass({class_name: classe.class_name,id:classe.id})}
      key={index}
    >
      {classe.class_name} 
    </SelectItem>
  ))}
</Select>
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
            <Button size='sm' className='bg-primaryColor text-white' onClick={handleUpload}>Ajouter l'emplois du temps au class</Button>
            </div>

            <div>

            </div>
          </div>
        );
      };
      
      export default UploadImage;