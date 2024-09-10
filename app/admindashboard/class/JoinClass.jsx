"use client"
import React, { useState, useEffect } from 'react';
import { Select, SelectItem, Button, Input } from '@nextui-org/react';
import { supabaseClient } from '@/app/utils/supabaseClient';
import { useAuth } from '@clerk/nextjs';

const JoinClass = ({classes,setClasses}) => {

    const { getToken } = useAuth();

    const [num_student, setNum_student] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedClass, setSelectedClass] = useState(null);
    const [errorStudent, setErrorStudent] = useState(false);




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

      const joinclass = async()=> {
        const trimmedStudentNumber = num_student.trim(); // Remove spaces
        if (trimmedStudentNumber === '') {return} 
        
        else {

            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
            const { data: fetchStudent, error: errorfetchedStudent } = await supabase
              .from('eleve')
              .update({class: selectedClass })
              .eq('user_id',selectedStudent.user_id)
            
            setNum_student('')
            setSelectedStudent('')

        };
        
      }


  return (
    <div>
      <h1 className='font-bold text-xl w-full mb-6'>Ajouter les élèves aux classes </h1>

      <div  className='flex items-center gap-4'>
  


       
<Input
          value={num_student}
          onChange={(e) => setNum_student(e.target.value)}
          radius="lg"
          size="sm"
          label="Numéro d'élève"
          type="text"
          labelPlacement="inside"
          className='w-fit'
        />
       
       
 
      <Select
  radius="lg"
  size="sm"
  label="Sélectionnez une classe"
  className="max-w-xs"
>
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
        <Button onClick={()=> joinclass()} className='bg-primaryColor text-white' >Ajouter un élève à la classe</Button>
    </div>
  
  {(selectedStudent !==null && num_student!=='') && (
    <div className="flex w-fit gap-6 mt-5 border-[1px] rounded-2xl p-2 px-3">
      <p>
        <span className="font-medium text-sm">Nom :</span> {selectedStudent.nom}
      </p>
      <p>
        <span className="font-medium text-sm">Prénom :</span> {selectedStudent.prenom}
      </p>
    </div>
  )}

{(errorStudent && num_student !== "") && 
  <p className="text-red-600 w-fit mt-5 border-[1px] rounded-2xl p-2 px-3">
    Nous n'avons pas trouvé d'étudiant avec ce numéro
  </p>}

</div>
  )
}

export default JoinClass