"use client"
import React, { useState , useEffect } from 'react';
import FatchDevoir from './FatchDevoir';

import { useAuth } from '@clerk/nextjs';
import { supabaseClient } from '@/app/utils/supabaseClient';
import { Textarea, Select , SelectItem ,Modal , Card, CardBody, ModalContent,Input, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import { Calendar } from 'primereact/calendar';
import { GoPlus } from "react-icons/go";
import { BsFillCalendarDateFill } from "react-icons/bs";


const page = () => {

    const { userId , getToken} = useAuth();
    const { isOpen, onOpen, onOpenChange , onClose } = useDisclosure();


    const [teacherMatiers , setTeacherMatiers] = useState([]);
    const [selectedMatiere , setSelectedMatiere] = useState('');

    const [classes , setClasses] = useState([]);
    const [selectedClass , setSelecyedClass] = useState('');


    const [title , setTitle] = useState('');
    const [description , setDescription] = useState('');
    const [date_debut, setDate_debut] = useState('');
    const [date_fin, setDate_fin] = useState('');

    const [fetchHomeWork , setfetchHomeWork] = useState(true)

    useEffect(() => {

      const fetchMatiers = async() => {
        try {
            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
            const { data, error } = await supabase
              .from('matiere')
              .select(' id ,matiere_name  , matiere_ensg(id,ensg_id  , class(id,class_name))')
              .eq('matiere_ensg.ensg_id', userId)


              
              const filteredMatieres = data.filter(matiere => matiere.matiere_ensg.length > 0);


              const transformedMatieres = filteredMatieres.map(matiere => ({
                class_id: matiere.matiere_ensg[0].class_id,
                matiere_name: matiere.matiere_name,
                matiere_id:matiere.id,
                matiere_ensg_id: matiere.matiere_ensg[0].id,
                class_id:matiere.matiere_ensg[0].class.id,
                class_name:matiere.matiere_ensg[0].class.class_name,

              }));




              setTeacherMatiers(transformedMatieres);
        
            if (error) {
              throw error;
            }
        
            return data;
          } catch (error) {
            console.error('Error fetching teacher matieres:', error.message);
            return [];
          }
      }

      fetchMatiers();
       
    }, [])

    
   

    useEffect(() => {
        const fetchClasses = async () => {
          try {
            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
            const { data, error } = await supabase
              .from('matiere_ensg')
              .select('class_id , class(class_name)')
              .eq('matiere_id', selectedMatiere)
              .eq('ensg_id' , userId)
      
            if (error) {
              throw error;
            }
      
            setClasses(data);
      
          } catch (error) {
            console.error('Error fetching teacher matieres:', error.message);
          }
        }
      
        if (selectedMatiere !== "") {
          fetchClasses();
        }
      
      }, [selectedMatiere]);


    const createHomework = async (e) => {
        e.preventDefault();
        try {
          const token = await getToken({ template: 'supabase' });
          const supabase = await supabaseClient(token);
          const { error } = await supabase
            .from('devoir')
            .insert({title:title, description: description , date_debut:date_debut ,date_fin:date_fin,ensg_id: userId , matiere_id:selectedMatiere , class_id:selectedClass });
          
          if (error) {
            throw error;
          }
          
          setTitle('');
          setDescription('');
          setSelectedMatiere('');
          setDate_debut('');
          setDate_fin('');
          setfetchHomeWork(!fetchHomeWork)

        } catch (error) {
          console.error('Error creating homework:', error.message);
        }
      };


 
  return (
    <div className='flex flex-col gap-8 z-40  '>

   
    <Button size='sm'  onPress={onOpen} className='bg-primaryColor text-white' endContent={<GoPlus />}>
    Ajouter un devoir
  </Button>
    <Modal 
        /* onClose ={()=>setRole("")} */
        size='sm'
        backdrop="opaque" 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <form onSubmit={createHomework}>
            <ModalHeader className="flex flex-col gap-1">Ajouter un devoir</ModalHeader>
            <ModalBody>
     
    <div className='flex flex-col gap-4'>

        <Input
          isRequired
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entrez le titre"
        />

      <Textarea
      isRequired
      label="Description"
      variant="bordered"
      placeholder="Entrez la description"
      disableAnimation
      disableAutosize
      onChange={(e) => setDescription(e.target.value)}
      
      classNames={{
        base: "max-w-full",
        input: "resize-y min-h-[40px]",
      }} />

      <div>

<div className='flex flex-wrap gap-x-3'>
      <div  className='mb-3 flex-1' >
        <label className='ml-1 mb-1 text-sm ' htmlFor="">Date Début</label>
        <Input onChange={(e) => setDate_debut(e.target.value)} type='date' />
      </div>
      <div  className='flex-1' >
        <label className='ml-1 mb-1 text-sm ' htmlFor="">Date fin</label>
        <Input onChange={(e) => setDate_fin(e.target.value)} type='date' />
      </div>

      </div>

      <Select
  radius="lg"
  size="sm"
  label="Sélectionnez matière"
  className="w-full"
>
  {teacherMatiers.map((matiere, index) => (
    <SelectItem
      value={selectedMatiere}
      className="whitespace-nowrap"
      onClick={() => setSelectedMatiere(matiere.matiere_id)}
      key={index}
      textValue={matiere.matiere_name}
    >
      {matiere.matiere_name}
    </SelectItem>
  ))}
</Select>

{ selectedMatiere !=='' &&
          <Select
          radius="lg"
          size="sm"
          label="Sélectionnez class"
          className="w-full mt-3"
        >
          {classes.map((classe, index) => (
            <SelectItem
              value={selectedClass}
              className="whitespace-nowrap"
              onClick={() => setSelecyedClass(classe.class_id)}
              key={index}
              textValue={classe.class.class_name}
            >
              {classe.class.class_name}
            </SelectItem>
          ))}
        </Select>
}
      
   
      
      

      </div>


      </div>
     

            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Fermer
              </Button>
              <Button type='submit' className='bg-primaryColor text-white' onSubmit={createHomework}>Ajouter</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
       

       <FatchDevoir fetchHomeWork={fetchHomeWork} userId={userId} getToken={getToken}/>
      </div>
  )
}

export default page