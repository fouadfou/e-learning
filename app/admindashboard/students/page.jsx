"use client"
import React, { useState, useEffect } from 'react';
import { Button, Input, Snippet } from '@nextui-org/react';
import { supabaseClient } from '@/app/utils/supabaseClient';
import { useAuth } from '@clerk/nextjs';
import { FiEdit } from "react-icons/fi";
import Update from './Update';


const Page = () => {
  const { getToken } = useAuth();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [visible, setVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

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
        class_name: item.class ? item.class.class_name : 'Pas de classe',
      }));

      const sortedData = formattedData.sort((a, b) => a.student_nom.localeCompare(b.student_nom));

      setStudents(sortedData);
      setFilteredStudents(sortedData); // Initially, show all students
    } catch (error) {
      console.error('Error fetching students:', error.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [getToken]);

  useEffect(() => {
    const filterStudents = () => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filteredBySearch = students.filter(student =>
        student.student_nom.toLowerCase().includes(lowerSearchTerm) ||
        student.student_prenom.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredStudents(filteredBySearch);
    };

    filterStudents();
  }, [searchTerm, students]);

  const openUpdateModal = (userId) => {
    setCurrentUserId(userId);
    setVisible(true);
  };

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='font-semibold text-xl'>Liste des élèves</h1>
      <Input
        placeholder="Rechercher par nom"
        onChange={(e) => setSearchTerm(e.target.value)}
        className='w-full mb-4'
      />
      <ul className='list-none p-0 border-t'>
        {filteredStudents.map((student, index) => (
          <li key={index} className='group flex justify-between border-b p-4 hover:bg-gray-100'>
            <div className='flex items-center gap-6'>
              <span className='bg-gray-200 rounded-full border-[1.5px] border-primaryColor w-10 h-10 flex items-center justify-center font-medium'>
                {student.student_nom[0].toUpperCase()}
              </span>
              <p className='text-start'>{student.student_nom} {student.student_prenom}</p>
              <p className='text-start'>{student.class_name}</p>
            </div>
            <div className='flex gap-4'>
              <Snippet>{student.student_num}</Snippet>
              <Button onClick={() => openUpdateModal(student.user_id)} isIconOnly className="bg-gray-200">
                <FiEdit />
              </Button>
              {visible && currentUserId === student.user_id && (
                <Update
                  user_id={student.user_id}
                  getToken={getToken}
                  fetchStudents={fetchStudents}
                  setVisible={setVisible}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
