"use client"
import React, { useState, useEffect , useMemo } from 'react';
import { Select, SelectItem, Button, Input } from '@nextui-org/react';
import { supabaseClient } from '@/app/utils/supabaseClient';
import { useAuth } from '@clerk/nextjs';


const AddClass = ({classes,setClasses}) => {
    
  const { getToken } = useAuth();

  const [trimestres, setTrimestres] = useState([]);
  const [selectedTrimester , setSelectedTrimester] = useState('');
  const [newClass , setNewClass] = useState('');




  const [niveaux , setNiveaux] = useState([]);
  const [selectedNiveau , setSelectedNiveau] = useState('');


  function getCurrentYear() {
    const currentDate = new Date();
    return currentDate.getFullYear();
  }

  const currentYear = useMemo(() => getCurrentYear(), []);

 
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      // Fetch all classes from Supabase
      const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
            .from('class').select('id,class_name,niveaux(niveau)')
            .order('created_at', { ascending: false });

            /* .select(`
              id,
              class_name,
              trimestre(trimestre),
              niveaux(niveau)
            `)
            ;
     */
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


  useEffect(() => {
    async function fetchNiveaux() {
      try {
        // Fetch all niveaux from Supabase
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase.from('niveaux').select('*');
        if (error) {
          throw error;
        }
        // Update the state with the fetched data
        setNiveaux(data);
      } catch (error) {
        console.error('Error fetching classes:', error.message);
      }
    }
    // Call the fetchClasses function
    fetchNiveaux();
  }, []);



  useEffect(() => {
    async function fetchTrimestres() {
      try {
        // Fetch all niveaux from Supabase
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase.from('trimestre').select('*').eq("annee_name",currentYear);
        if (error) {
          throw error;
        }
        // Update the state with the fetched data
        setTrimestres(data);
      } catch (error) {
        console.error('Error fetching classes:', error.message);
      }
    }
    // Call the fetchClasses function
    fetchTrimestres();
  }, []);




  const addClass = async () => {
    try {
      if (newClass.trim() !== '') {
        // Insert the new class into the 'classes' table
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase.from('class').insert([{ class_name: newClass , niveau:selectedNiveau  }]);
        if (error) {
          throw error;
        }
        // Update the state with the new class
        const sortedClasses = [...classes].sort((a, b) => {
          const niveauA = parseInt(a.niveau.split(' ')[1]);
          const niveauB = parseInt(b.niveau.split(' ')[1]);
          return niveauA - niveauB;
        });

        setClasses([...sortedClasses, { class: newClass }]);
        fetchClasses()
        // Clear the input field
        setNewClass('');
      }
    } catch (error) {
      console.error('Error adding class:', error.message);
    }
  };

  


  return (

    <div className='flex flex-col gap-6 border-t pt-6'>
    <div className='flex items-center gap-4 '>

        <Input
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            radius="lg"
            size="sm"
            label="Nom de class"
            type="text"
            className='w-auto'
            labelPlacement="inside"
        />

        <Select 
         radius ="lg"
         size='sm'
        label="Sélectionnez un niveau" 
        className="max-w-xs" 
      >
        {niveaux.map((niveau , index) => (
          <SelectItem className="whitespace-nowrap" onClick={() => setSelectedNiveau(niveau.id)} key={index} value={selectedNiveau}>
            {niveau.niveau}
          </SelectItem>
        ))}
      </Select>


    {/*   <Select 
         radius ="lg"
         size='sm'
        label="Select an trimestre" 
        className="max-w-xs" 
      >
        {trimestres.map((trimestre , index) => (
          <SelectItem className="whitespace-nowrap" onClick={() => setSelectedTrimester(trimestre.id)} key={index} value={selectedTrimester}>
            {trimestre.trimestre}
          </SelectItem>
        ))}
      </Select>
 */}
      <Button onClick={()=> addClass()} className='bg-primaryColor text-white'> Ajouter une classe </Button>

      
      
    </div>

<div>
    <h2 className='font-medium mb-3 ml-1'>Les classes : </h2>

     <ul className='border-[1px] rounded-lg'>
        {classes.map((classe, index) => (
          <li className='border-b-[1px] p-3 text-sm flex gap-6' key={index}>
            <p>{classe.class_name}</p>
            /
            <p>{classe.niveau}</p>
          </li>
        ))}
      </ul> 
      </div>
    </div>
  )
}

export default AddClass