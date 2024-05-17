"use client"
import React, { useState, useEffect } from 'react';
import { Select, SelectItem, Button, Input } from '@nextui-org/react';
import { supabaseClient } from '@/app/utils/supabaseClient';
import { useAuth } from '@clerk/nextjs';

const Page = () => {
  const { getToken } = useAuth();

  const [num_student, setNum_student] = useState('');
  const [parentUsername, setParentUsername] = useState('');
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [errorStudent, setErrorStudent] = useState(false);
  const [errorParent, setErrorParent] = useState(false);


  useEffect(() => {

    const fetchStudentByNumber = async () => {
      const trimmedStudentNumber = num_student.trim(); // Remove spaces
      if (trimmedStudentNumber === '') return;

      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
        const { data: fetchStudent, error: errorfetchedStudent } = await supabase
          .from('eleve')
          .select('user_id')
          .eq('num_eleve', trimmedStudentNumber)
          .single();

        if (errorfetchedStudent || !fetchStudent) {
            setErrorStudent(true);
          setSelectedStudent(null);
          return;
        }

        const { data: studentInfo, error } = await supabase
          .from('users')
          .select('nom, prenom')
          .eq('user_id', fetchStudent.user_id)
          .single();

        if (error || !studentInfo) {
            setErrorStudent(true);
          setSelectedStudent(null);
          return;
        }

        setErrorStudent(false);
        setSelectedStudent({user_id:fetchStudent.user_id, nom: studentInfo.nom, prenom: studentInfo.prenom });
      } catch (error) {
        console.error('Error fetching student:', error.message);
        setErrorStudent(true);
        setSelectedStudent(null);
      }
    };

    fetchStudentByNumber();
  }, [num_student, getToken]);


  useEffect(() => {
    const fetchParentByUsername = async () => {
      if (parentUsername === '') return;

      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
        const { data: fetchParent, error: errorfetchedParent } = await supabase
          .from('users')
          .select('user_id ,nom , prenom')
          .eq('username', parentUsername)
          .eq('role','Parent')
          .single();

        if (errorfetchedParent || !fetchParent) {
          setErrorParent(true);
          setSelectedParent(null);
          return;
        }

        setErrorParent(false);
        setSelectedParent(fetchParent);
      } catch (error) {
        console.error('Error fetching parent:', error.message);
        setErrorParent(true);
        setSelectedParent(null);
      }
    };

    fetchParentByUsername();
  }, [parentUsername, getToken]);


  const handleSubmit = async () => {
    try {

      console.log("selectedParent",selectedParent)
      console.log("selectedStudent",selectedStudent)
      
      const token = await getToken({ template: 'supabase' });
      const supabase = await supabaseClient(token);
      const { data: fetchParent, error: errorfetchedParent } = await supabase
        .from('parent_eleve')
        .insert({
          parent: `${selectedParent.nom} / ${selectedParent.prenom}`,
          eleve: `${selectedStudent.nom} / ${selectedStudent.prenom}`,
          parent_id: selectedParent.user_id,
          eleve_id: selectedStudent.user_id
        });
  
      if (errorfetchedParent) {
        console.error('Error adding parent to student:', errorfetchedParent.message);
        // Handle error here
        return;
      }
  
      // Success message or any further action
    } catch (error) {
      console.error('Error adding parent to student:', error.message);
      // Handle error here
    }
  };


  return (
    <div className="flex-1 p-8 flex flex-col gap-4">
      
      <h2 className="text-xl font-semibold">Connect Parent with Child</h2>

      <div className="flex flex-col gap-3">
        <Input
          value={num_student}
          onChange={(e) => setNum_student(e.target.value)}
          radius="lg"
          size="sm"
          label="Numéro d'étudiant"
          type="text"
          labelPlacement="inside"
        />

        {selectedStudent && (
          <div className="flex gap-6">
            <p>
              <span className="font-medium">Nom :</span> {selectedStudent.nom}
            </p>
            <p>
              <span className="font-medium">Prénom :</span> {selectedStudent.prenom}
            </p>
          </div>
        )}

        {(errorStudent && num_student!=="") && <p className="text-red-600">We couldn't find a student with this number.</p>}
      </div>

      <div className="flex flex-col gap-3">
        <Input
          value={parentUsername}
          onChange={(e) => setParentUsername(e.target.value)}
          radius="lg"
          size="sm"
          label="Nom d'utilisateur du parent"
          type="text"
          labelPlacement="inside"
        />

    {selectedParent && (
              <div className="flex gap-6">
                <p>
                  <span className="font-medium">Nom :</span> {selectedParent.nom}
                </p>
                <p>
                  <span className="font-medium">Prénom :</span> {selectedParent.prenom}
                </p>
              </div>
            )}

        {(errorParent && parentUsername !== '') && <p className="text-red-600">Nous n'avons pas trouvé de parent avec ce nom d'utilisateur</p>}
      </div>

      <Button onClick={handleSubmit} className="bg-primaryColor text-white">Relier le parent et l'enfant</Button>
    </div>
  );
};

export default Page;
