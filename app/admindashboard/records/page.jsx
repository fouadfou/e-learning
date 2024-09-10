"use client"
import React, { useState, useEffect } from 'react';
import { Input, Button , Select, SelectItem } from '@nextui-org/react';
import { useAuth } from '@clerk/nextjs';
import { supabaseClient } from '@/app/utils/supabaseClient';
import { DatePicker } from 'antd';

const Page = () => {
  const { getToken } = useAuth();

  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [num_student, setNum_student] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [errorStudent, setErrorStudent] = useState(false);
  const [trimestres , setTrimestres] =  useState([]);
  const [selectedtrimestre , setSelectedtrimestre] = useState(null);
  const [selectedYear , setSelectedYear] = useState(null);
  const [years, setYears]  = useState([]);

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
        setSelectedStudent({ user_id: fetchStudent.user_id, nom: studentInfo.nom, prenom: studentInfo.prenom });
      } catch (error) {
        console.error('Error fetching student:', error.message);
        setErrorStudent(true);
        setSelectedStudent(null);
      }
    };

    fetchStudentByNumber();
  }, [num_student, getToken]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Invalid file type. Please select a Word (docx) or PDF file.');
    }
  };

  const handleAddRelevés = async () => {
    if (!file || !selectedtrimestre || !selectedStudent) {
      setError('Please select a file, trimestre, and student.');
      return;
    }
  
    try {
      const token = await getToken({ template: 'supabase' });
      const supabase = await supabaseClient(token);
      
      // Upload the file
      const { data: UploadData, error: uploadError } = await supabase.storage
        .from('emplois_du_temps')
        .upload(`releves/${file.name}`, file, {
          contentType: file.type,
        });
  
      if (uploadError) throw uploadError;
  
      // Get the public URL of the uploaded file
      const { data: FileUrl, error: urlError } = await supabase.storage
        .from('emplois_du_temps')
        .getPublicUrl(UploadData.path);
  
      if (urlError) throw urlError;
  
      // Insert the file URL into the 'releves' table
      const { error: errEmp } = await supabase
        .from('releves')
        .insert({ releve: FileUrl.publicUrl.toString(), eleve_id: selectedStudent.user_id, trimestre_id: selectedtrimestre });
  
      if (errEmp) throw errEmp;

      setError(null);
      setFile(null);
    } catch (error) {
      setError('File upload failed. Please try again.');
    }
  };

  useEffect(() => {

    const fetchTrimestres = async() => {

      try {

        const token = await getToken({ template: 'supabase' });
      const supabase = await supabaseClient(token);
      const { data, error } = await supabase
      .from('trimestre')
      .select("* , annee(annee)")
      .eq('annee.annee', selectedYear)


      setTrimestres(data)
        
      } catch (error) {
        console.error('Error fetching trimestres:', error.message);
        
      }

    }

    selectedYear !=="" && fetchTrimestres();

  }, [selectedYear])


  useEffect(() => {
    const fetchYears = async() => {

      try {

        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
        .from('annee')
        .select("*")
        
        setYears(data);
      } catch (error) {
        console.error('Error fetching years:', error.message);
        
      }

    }  
    
    fetchYears();
  }, [getToken])

  
  const disabledDate = (current) => {
    // Disable all dates which are not in the years array
    return !years.some((year) => moment(current).isSame(year.year, 'year'));
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className='font-bold text-xl w-full mb-6'>Ajouter les relevés</h1>

      <input
        onChange={handleFileChange}
        className="block w-full text-sm file:bg-primaryColor file:p-2 file:px-4  file:border-0  file:text-white text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="file_input"
        type="file"
        accept=".pdf,.docx"
      />
      

      <Input
        value={num_student}
        onChange={(e) => setNum_student(e.target.value)}
        radius="lg"
        size="sm"
        label="Numéro d'élève"
        type="text"
        labelPlacement="inside"
        className="w-fit"
      />

      {selectedStudent !== null && num_student !== '' && (
        <div className="flex w-fit gap-6 border-[1px] rounded-2xl p-2 px-3">
          <p>
            <span className="font-medium text-sm">Nom :</span> {selectedStudent.nom}
          </p>
          <p>
            <span className="font-medium text-sm">Prénom :</span> {selectedStudent.prenom}
          </p>
        </div>
      )}

   {errorStudent && num_student !== '' && (
        <p className="text-red-600 w-fit border-[1px] rounded-2xl p-2 px-3">
          Nous n'avons pas trouvé d'étudiant avec ce numéro
        </p>
      )}

{/* <DatePicker
            picker="year"
            placeholder="Année"
            width={300}
            disabledDate={disabledDate}
            onChange={(dateString) => setUpdate_Year(dateString ? new Date(dateString).getFullYear() : '')} // Update selectedYear state with the chosen year
            />
 */}
<Select 
         radius ="lg"
         size='sm'
        label="Sélectionnez Année scholaire" 
        className="max-w-xs" 
      >
        {years.map((year , index) => (
          <SelectItem className="whitespace-nowrap" onClick={() => setSelectedYear(year.id)} key={index} value={selectedYear}>
            {year.annee}
          </SelectItem>
        ))}
      </Select>

  {selectedYear !== null && (<Select 
         radius ="lg"
         size='sm'
        label="Sélectionnez trimestre" 
        className="max-w-xs" 
      >
        {trimestres.map((trimestre , index) => (
          <SelectItem className="whitespace-nowrap" onClick={() => setSelectedtrimestre(trimestre.id)} key={index} value={selectedtrimestre}>
            {trimestre.trimestre}
          </SelectItem>
        ))}
      </Select>)
      } 





      
      <Button className="bg-primaryColor text-white w-fit" onClick={handleAddRelevés}>
        Ajouter relevés
      </Button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Page;
