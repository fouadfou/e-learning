"use client"
import React, { useState, useEffect , useRef} from 'react';
import { Select, SelectItem, Button, Input , Chip } from '@nextui-org/react';
import { supabaseClient } from '@/app/utils/supabaseClient';
import { useAuth } from '@clerk/nextjs';
import AddAbsence from './AddAbsence'; 
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const page = () => {

    const { getToken } = useAuth();



    const [absences , setAbsences] = useState([]);
    const [fatchAbsencesBool ,setFatchAbsencesBool] = useState(false);


     
      useEffect(() => {
       const fetchAbsences = async()=>{
         try {

        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
        .from('absence')
        .select('* , eleve(user_id,users(nom,prenom),class(class_name)) ")')
        .order('created_at', { ascending: false });
        


        const CombinationObjects = data.map(item => ({
            date_abs: item.date_abs.replace('T', ' / ').slice(0,-6),
            eleve_nom: item.eleve.users.nom,
            eleve_prenom: item.eleve.users.prenom,
            eleve_id:item.eleve_id,
            description:item.description,
            notifier:item.notifier,
            id:item.id,
            class_name:item.eleve.class.class_name,
          }));

         
        setAbsences(CombinationObjects)
            
         } catch (error) {
        console.error('Error fetching absences:', error.message);
            
         }

       }

       fetchAbsences()
    }, [getToken ,fatchAbsencesBool]) 


    const reqToResend = async(eleve_id , absence) => {
            
        try {
            const id = toast.loading("Please wait..." )

            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
            const { data:parents, error } = await supabase
            .from('parent_eleve')
            .select('parent_id , parent(email)')
            .eq("eleve_id",eleve_id)

            const CombinationObjects =  parents.map( item => ({
                parent_email: item.parent.email,  
              }));



              if (CombinationObjects.length === 0) {
               /*  showNotification('error', 'Failed to send email: Parent email not found.'); */
                
                toast.update(id, {
                  render: "Failed to send email: Parent email not found",
                  type: "error",
                  isLoading: false,
                  hideProgressBar: false,
                  autoClose: 1000,
                  progress: null,
                })
                return;
              } else {


              const response = await axios.post('/api/email', { emails: CombinationObjects , absence : absence});
              console.log("resposne" ,response)
              if(response.status === 200) {

                await supabase
                .from('absence')
                .update({notifier:true})
                .eq("id",absence.id)

                /* showNotification('success', 'Email sent'); */
               
                toast.update(id, {
                  render: "Email sent",
                  type: "success",
                  isLoading: false,
                  hideProgressBar: false,
                  autoClose: 500,
                  progress: null,
                })

              } else {
                /* showNotification('error', 'Email not sent'); */
                toast.update(id, {
                  render: "Email not sent'",
                  type: "error",
                  isLoading: false,
                  hideProgressBar: false,
                  autoClose: 500,
                  progress: null,
                })
              }

            }
        } catch (error) {
            
        }
    }


    useEffect(() => {
      const setupAbsenceChannel = async () => {
        try {
          const token = await getToken({ template: 'supabase' });
          const supabase = await supabaseClient(token);
    
      
          const handleUpdates = async (payload) => {
  

            setAbsences((prevAbsences) =>
              prevAbsences.map((absence) =>
                absence.id === payload.new.id ? { ...absence, notifier: payload.new.notifier } : absence
              )
            );
          }
        
          supabase
            .channel('absence_channel')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'absence' }, handleUpdates)
            .subscribe();
    
        } catch (error) {
          console.error('Error setting up absence channel:', error.message);
        }
      };
    
      setupAbsenceChannel();
    }, []);

    const deletAbsence = async (absence_id) => {

      const token = await getToken({ template: 'supabase' });
      const supabase = await supabaseClient(token);
      const { data:parents, error } = await supabase
      .from('absence')
      .delete()
      .eq('id', absence_id)

      if (error) {
        throw error;
      }

      setAbsences(prevAbsences => prevAbsences.filter(absence => absence.id !== absence_id));


    }

  return (
    <div className="flex flex-col gap-4">
      <AddAbsence setFatchAbsencesBool={setFatchAbsencesBool} getToken={getToken} />

      <h1 className='font-bold text-xl w-full border-t pt-6 mt-5 p-1'>Toutes les absences</h1>
      
      <ToastContainer position="top-right"
  autoClose={2000}
  hideProgressBar
  newestOnTop
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover />

      <ul className=' grid grid-cols-cards gap-4'>
        {absences.map((absence, index) => (
          <li style={{boxShadow:"rgba(0, 0, 0, 0.1) 0px 4px 12px"}} className='border-[1px]  bg-white p-2 pt-1 rounded-xl text-sm flex flex-col ' key={index}>

            <div className='flex justify-between w-full rounded-t-xl font-bold p-4'>
            <h2>Absence : " {(absence.eleve_nom).toUpperCase()} {(absence.eleve_prenom).toUpperCase()} " / Class : " {absence.class_name} "</h2>

            <Chip  size='sm' color={`${absence.notifier ? "success":"danger"}`} variant='flat'> {absence.notifier ? "notifiés" : "non notifiés"}</Chip>

            </div>

            <div className='flex flex-col gap-4 p-4 bg-grayBg rounded-lg grow'>
            
            {/*     <p><b>Matiere : </b> {absence.matiere_name} </p>
                <p><b>Élève : </b> {absence.eleve_nom} {absence.eleve_prenom} </p>
                <p><b>Enseignante(e) : </b> {absence.ensg_nom} {absence.ensg_prenom} </p>
 */}
                
            
            <p>{absence.description} le {absence.date_abs}</p>





            <div className='flex  flex-wrap gap-2  mt-auto '>

            <Button onClick={() => reqToResend(absence.eleve_id , absence)} size='sm' className='bg-gray-800 bg-blue-500 text-white '> Informer les parents </Button>
            

            <Button onClick={() => deletAbsence(absence.id)}  size='sm' className="bg-[#F9494B] text-white grow"> Supprimer </Button>
            </div>
            
            </div>

          </li>
        ))}
      
      </ul>
    </div>
  );
};

export default page;
