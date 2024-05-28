"use client"
import React, { useState, useEffect } from 'react';
import { Select, SelectItem, Button, Input } from '@nextui-org/react';
import { supabaseClient } from '@/app/utils/supabaseClient';


const JoinMatieres = ({ getToken, matieres}) => {
 

    const [selectedMatiere , setSelectedMatiere] = useState({})
    const [niveaux , setNiveaux] = useState([]);
    const [selectedNiveau , setSelectedNiveau] = useState('');

    const [classes , setClasses] = useState([]);
    const [selectedClass , setSelectedClass] = useState('');

    const [teacherUsername, setTeacherUsername] = useState('');
    const [selectedTeacher , setSelectedTeacher] = useState('')
    const [errorteacher, setErrorTeacher] = useState(false);



    
    useEffect(() => {
        const fetchNiveaux = async () => {
          try {
            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
            const { data, error } = await supabase.from('niveaux').select('*');
    
            if (error) {
              throw error;
            }
    
            setNiveaux(data);
          } catch (error) {
            console.error('Error fetching niveaux:', error.message);
          }
        };
    
        fetchNiveaux();
      }, []);


      useEffect(() => {
        const fetchClasses = async () => {
          try {
            console.log("foufou")
            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
            const { data, error } = await supabase.from('class').select('*').eq("niveau",selectedNiveau);
    
            if (error) {
              throw error;
            }
    
            setClasses(data);
          } catch (error) {
            console.error('Error fetching niveaux:', error.message);
          }
        };
    
        selectedNiveau !=="" && fetchClasses();

      }, [selectedNiveau]);


      useEffect(() => {
        const fetchteacherByUsername = async () => {
          if (teacherUsername === '') return;
    
          try {
            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
            const { data: fetchteacher, error: errorfetchedteacher } = await supabase
              .from('users')
              .select('user_id ,nom , prenom')
              .eq('username', teacherUsername)
              .eq('role','Teacher')
              .single();

            if (errorfetchedteacher || !fetchteacher) {
              setErrorTeacher(true);
              setSelectedTeacher(null);
              return;
            }
    
            setErrorTeacher(false);
            setSelectedTeacher(fetchteacher);
          } catch (error) {
            console.error('Error fetching teacher:', error.message);
            setErrorTeacher(true);
            setSelectedTeacher(null);
          }
        };
    
        fetchteacherByUsername();
      }, [teacherUsername, getToken]);

      const joinSubject = async (e) => {

        e.preventDefault();

    if (!selectedMatiere || !selectedNiveau || !selectedClass || !selectedTeacher) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

        try {
          const token = await getToken({ template: 'supabase' });
          const supabase = await supabaseClient(token);
          const { data, error } = await supabase
            .from('matiere_ensg')
            .insert({ matiere_id: selectedMatiere.id,matiere_name:selectedMatiere.matiere_name ,class_id: selectedClass, ensg_id: selectedTeacher.user_id });
          
          if (error) {
            throw error;
          }

          setSelectedMatiere("");
          setSelectedNiveau("");
          setSelectedTeacher(null);
          setSelectedClass("");
          setTeacherUsername("");

        } catch (error) {
          console.error('Error joining subject:', error.message);
        }
      };

  return (
    <div>
      <h1 className='font-bold text-xl w-full mb-6'>Attribution des matières et des enseignants dans les salles de classe</h1>

    <form onSubmit={joinSubject} className='border-b-[1px] pb-8'>
    <div className='flex flex-wrap items-center gap-4'>
         <Select 
         radius ="lg"
         size='sm'
        label="Sélectionnez une matiere" 
        className="flex-1 min-w-[12rem]" 
        isRequired

      >
        {matieres.map((matiere , index) => (
          <SelectItem className="whitespace-nowrap" onClick={() => setSelectedMatiere({ id: matiere.id, matiere_name: matiere.matiere_name , class_name:matiere.class_name })} key={index} value={selectedMatiere}>
            {matiere.matiere_name}
          </SelectItem>
        ))}
      </Select>

      <Select 
         radius ="lg"
         size='sm'
        label="Sélectionnez un niveau" 
        className="flex-1 min-w-[12rem]" 
        isRequired
      >
        {niveaux.map((niveau , index) => (
          <SelectItem className="whitespace-nowrap " onClick={() => setSelectedNiveau(niveau.id)} key={index} value={selectedNiveau}>
            {niveau.niveau}
          </SelectItem>
        ))}
      </Select>

      <Select
      isDisabled={selectedNiveau ===""}
  radius="lg"
  size="sm"
  label="Sélectionnez une classe"
  className="flex-1 min-w-[12rem]"
  isRequired
>
  {classes.map((classe, index) => (
    <SelectItem
      value={selectedClass}
      className="whitespace-nowrap"
      onClick={() => setSelectedClass(classe.id)}
      key={index}
    >
      {classe.class_name} 
    </SelectItem>
  ))}
</Select>

<Input
          value={teacherUsername}
          onChange={(e) => setTeacherUsername(e.target.value)}
          radius="lg"
          size="sm"
          label="Nom d'utilisateur de l'enseignant"
          type="text"
          labelPlacement="inside"
          isRequired
        />

        <div>
        {selectedTeacher && (
          <div className="flex gap-6">
            <p>
              <span className="font-medium">Nom :</span> {selectedTeacher.nom}
            </p>
            <p>
              <span className="font-medium">Prénom :</span> {selectedTeacher.prenom}
            </p>
          </div>
        )}

        {(errorteacher && teacherUsername!=="") && <p className="text-red-600">Nous n'avons pas trouvé d'enseignant avec ce numéro</p>}
        </div>
    

        </div>
        <Button type="submit"  className='bg-primaryColor text-white mt-4'>Ajouter</Button>

    </form>
    </div>
  )
}

export default JoinMatieres