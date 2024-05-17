"use client"
import React, { useState, useEffect } from 'react';
import { Button, Input } from '@nextui-org/react';
import { supabaseClient } from '@/app/utils/supabaseClient';

const AddSubject = ({ getToken, matieres, setMatieres }) => {

  const [matiereName, setMatiereName] = useState('');

  async function fetchMatiers() {
    try {
      // Fetch all matieres from Supabase
      const token = await getToken({ template: 'supabase' });
      const supabase = await supabaseClient(token);
      const { data, error } = await supabase.from('matiere').select('*');
      if (error) {
        throw error;
      }

      // Update the state with the fetched data
      setMatieres(data);
    } catch (error) {
      console.error('Error fetching matieres:', error.message);
    }
  }

  useEffect(() => {
   
    // Call the fetchMatiers function
    fetchMatiers();
  }, []);

  const addMatiere = async () => {
    try {
      const token = await getToken({ template: 'supabase' });
      const supabase = await supabaseClient(token);
      const { data, error } = await supabase.from('matiere').insert([{ matiere_name: matiereName }]);
    
      if (error) {
        throw error;
      }
      // Update the state with the fetched data
      if (data) {
        setMatieres(prevMatieres => [...prevMatieres, ...data]);
      }
      // Clear the input field
      setMatiereName('');
      fetchMatiers();

    } catch (error) {
      console.error('Error adding matiere:', error.message);
    }
  };




  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center gap-4'>
        <Input
          value={matiereName}
          onChange={(e) => setMatiereName(e.target.value)}
          radius="lg"
          size="sm"
          label="Nom de matiere"
          type="text"
          labelPlacement="inside"
          className='w-fit'
        />
        <Button className='bg-primaryColor text-white' onClick={addMatiere}>Ajouter une matiere</Button>
      </div>
      
      <div>
        <h2 className='font-medium mb-3 ml-1'> Liste des matières </h2>
       {  <ul className='border-[1px] rounded-lg'>
          {matieres.map((matiere, index) => (
            <li className='border-b-[1px] p-3 text-sm flex gap-6' key={index}>
              <p>{matiere.matiere_name.charAt(0).toUpperCase() + matiere.matiere_name.slice(1)}</p>
            </li>
          ))}
        </ul> }
      </div>
    </div>
  );
};

export default AddSubject;
