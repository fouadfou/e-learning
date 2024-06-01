import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Select, SelectItem, Button, Input  , Textarea} from '@nextui-org/react';
import { supabaseClient } from '@/app/utils/supabaseClient';
import { DatePicker } from 'antd';


const AddAbsence = ({getToken ,setFatchAbsencesBool }) => {


  const [num_student, setNum_student] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [errorStudent, setErrorStudent] = useState(false);
  const [timeSelected, setTimeSelected] = useState('');
  const [descriptionContent, setDescriptionContent] = useState('');

/*   const [selectedMatiere, setSelectedMatiere] = useState('');
  const [matieres, setMatieres] = useState([]);

  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [teachers, setTeachers] = useState([]); 

  useEffect(() => {
    const fetchMatiers = async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase.from('matiere').select('*');

        setMatieres(data);
      } catch (error) {
        console.error('Error fetching matieres:', error.message);
      }
    };

    fetchMatiers();
  }, [getToken]); */


  useEffect(() => {
    const fetchStudentByNumber = async () => {
      const trimmedStudentNumber = num_student.trim(); // Remove spaces
      if (trimmedStudentNumber === '') return;
  
      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
        const { data: fetchStudent, error: errorfetchedStudent } = await supabase
          .from('eleve')
          .select('user_id , users(nom,prenom), class(id)')
          .eq('num_eleve', trimmedStudentNumber)
          .single();
  
  
        if (errorfetchedStudent || !fetchStudent) {
          setErrorStudent(true);
          setSelectedStudent(null);
          return;
        }
  
        const CombinationObjects = {
          user_id: fetchStudent.user_id,
          nom: fetchStudent.users.nom,
          prenom: fetchStudent.users.prenom,
          class_id: fetchStudent.class.id
        };
  
        setErrorStudent(false);
        setSelectedStudent(CombinationObjects);
  
      } catch (error) {
        console.error('Error fetching student:', error.message);
        setErrorStudent(true);
        setSelectedStudent(null);
      }
    };
  
    num_student !=="" && fetchStudentByNumber();
  }, [num_student, getToken]);


/*   useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
          .from('matiere_ensg')
          .select('ensg_id ')
          .eq('matiere_id', selectedMatiere.id)
          .eq('class_id', selectedStudent.class_id);
      
        setSelectedTeacher(data[0].ensg_id);

      } catch (error) {
        console.error('Error fetching teacher:', error.message);
      }
    };

    selectedMatiere !== '' && fetchTeachers();
  }, [selectedMatiere, getToken]); */

  const addAbsence = async (e) => {

    e.preventDefault();

    try {
      const token = await getToken({ template: 'supabase' });
      const supabase = await supabaseClient(token);
      const { data, error } = await supabase
        .from('absence')
        .insert({
          eleve_id: selectedStudent.user_id,
          date_abs: timeSelected,
          description: descriptionContent,
        });


      setFatchAbsencesBool(prev => !prev);
      // Reset the form
      setNum_student('');
      setSelectedStudent('');
      setErrorStudent(false);
      setTimeSelected('');
      setDescriptionContent('');
     /*  setSelectedMatiere('');
      setSelectedTeacher(''); */


    } catch (error) {
      console.error('Error add absence:', error.message);
    }
  };


  console.log("description", descriptionContent)
  return (
    <div >
      <h1 className='font-bold text-xl w-full mb-6'>Ajouter une absence</h1>

          <form className="flex flex-wrap items-center gap-4" onSubmit={addAbsence}>
        <Input
          size="sm"
          value={num_student}
          onChange={e => setNum_student(e.target.value)}
          radius="lg"
          label="Numéro d'étudiant"
          type="text"
          labelPlacement="inside"
          className="w-fit"
          isRequired
        />
        <DatePicker value={timeSelected !== "" ? moment(timeSelected) : ""}   required placeholder="Date d'absence" showTime onChange={(_, dateStr) => setTimeSelected(dateStr)} />


       <Textarea

      label="Description"
      placeholder="Enter your description"
      className="max-w-xs"
      onChange={(e) => setDescriptionContent(e.target.value)}
      isRequired
      value={descriptionContent}

    />
       
       {/* 
       
        <Select  textValue={selectedMatiere ? selectedMatiere.matiere_name : ''} radius="lg" size="sm" label="Sélectionnez une matière" className="flex-1 min-w-[12rem]" isRequired>
          {matieres.map((matiere, index) => (
            <SelectItem
              isRequired
              className="whitespace-nowrap"
              onClick={() => setSelectedMatiere({id:matiere.id ,matiere_name:matiere.matiere_name })}
              key={index}
              value={selectedMatiere.matiere_id}
            >
              {matiere.matiere_name}
            </SelectItem>
          ))}
        </Select>
       <Select
          isRequired
          isDisabled={selectedMatiere === ''}
          radius="lg"
          size="sm"
          label="Sélectionnez un enseignante"
          className="flex-1 min-w-[12rem]"
        >
          {teachers.map((teacher, index) => (
            <SelectItem
              textValue={`${teacher.nom} ${teacher.prenom}`}
              className="whitespace-nowrap"
              onClick={() => setSelectedTeacher({id:teacher.ensg_id ,nom:teacher.nom , prenom:teacher.prenom})}
              key={index}
            >
              {teacher.nom} {teacher.prenom}
            </SelectItem>
          ))}
        </Select> */}
        <Button className="bg-primaryColor text-white" type="submit">
          {' '}
          Ajouter une absence
        </Button>
      </form>

      {selectedStudent !== null && num_student !== '' && (
        <div className="flex w-fit gap-6 mt-5 border-[1px] rounded-2xl p-2 px-3">
          <p>
            <span className="font-medium text-sm">Nom :</span> {selectedStudent.nom}
          </p>
          <p>
            <span className="font-medium text-sm">Prénom :</span> {selectedStudent.prenom}
          </p>
        </div>
      )}
      {errorStudent && num_student !== '' && (
        <p className="text-red-600 w-fit mt-5 border-[1px] rounded-2xl p-2 px-3">
          Nous n'avons pas trouvé d'étudiant avec ce numéro
        </p>
      )}
    </div>
  )
}

export default AddAbsence