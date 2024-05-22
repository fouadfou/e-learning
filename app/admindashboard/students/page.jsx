"use client"
import React, { useState, useEffect } from 'react';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { supabaseClient } from '@/app/utils/supabaseClient';
import { useAuth } from '@clerk/nextjs';

const Page = () => {
  const { userId, getToken } = useAuth();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [classes , setClasses] = useState([]);


  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
          .from('eleve')
          .select('*, users(nom, prenom), class(class_name)');

        if (error) {
          throw error;
        }

        const formattedData = data.map(item => ({
          user_id: item.user_id,
          student_num: item.num_eleve,
          student_nom: item.users.nom,
          student_prenom: item.users.prenom,
          class_name: item.class.class_name,
        }));

        setStudents(formattedData);
        setFilteredStudents(formattedData); // Initially, show all students
      } catch (error) {
        console.error('Error fetching students:', error.message);
      }
    };

    fetchStudents();
  }, [getToken]);

 


  useEffect(() => {

    const fetchClasses = async () => {
        try {
          // Fetch all classes from Supabase
          const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
            const { data, error } = await supabase
                .from('class').select('id,class_name,niveaux(niveau)')
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
    
      fetchClasses();
  }, [ getToken])
  
  useEffect(() => {
    const filterStudents = () => {
      const lowerSearchTerm = searchTerm.toLowerCase();
  
      if (selectedClass !== "") {
        // Filter based on selected class
        const filteredByClass = students.filter(student => student.class_id === selectedClass);

        setFilteredStudents(filteredByClass);
  
        // Filter further based on search term
        const filteredBySearch = filteredByClass.filter(student =>
          student.student_nom.toLowerCase().includes(lowerSearchTerm) ||
          student.student_prenom.toLowerCase().includes(lowerSearchTerm)
        );
  
        setFilteredStudents(filteredBySearch);
      } else {
        // Filter based on search term only
        const filteredBySearch = students.filter(student =>
          student.student_nom.toLowerCase().includes(lowerSearchTerm) ||
          student.student_prenom.toLowerCase().includes(lowerSearchTerm)
        );
  
        setFilteredStudents(filteredBySearch);
      }
    };
  
    filterStudents();
  }, [searchTerm, selectedClass, students]);

  return (
    <div className='p-8 w-full flex flex-col gap-4'>
      <Input
        placeholder="Search by name"
        onChange={(e) => setSearchTerm(e.target.value)}
        className='w-full mb-4'
      />
     <Select
  radius="lg"
  size="sm"
  label="Sélectionnez une classe"
  className=""
>
    <SelectItem value="">Tout les classes</SelectItem>
  {classes.map((classe, index) => (
    <SelectItem
      value={selectedClass}
      className="whitespace-nowrap"
      onClick={() => setSelectedClass(classe.class_id)}
      key={index}
      textValue={`${classe.class_name} / ${classe.niveau}`}
    >
      {classe.class_name} / {classe.niveau}
    </SelectItem>
  ))}
</Select>
      <ul className='list-none p-0'>
        {filteredStudents.map((student, index) => (
          <li key={index} className='border p-4 mb-2 rounded'>
            <p><strong>Student Number:</strong> {student.student_num}</p>
            <p><strong>Name:</strong> {student.student_nom} {student.student_prenom}</p>
            <p><strong>Class:</strong> {student.class_name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;