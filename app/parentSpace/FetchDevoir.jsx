"use client"
import React , {useState , useEffect} from 'react'
import { supabaseClient } from '../utils/supabaseClient';
import { FaChild } from "react-icons/fa6";


const fetchDevoir = ({getToken , childrens }) => {

  const [HomeWorks , setHomeWorks] = useState([]);

  useEffect(() => {

    const getHomeworks = async () => {
         
         const devoirs = [];


          try {

            // Fetch homeworks based on class_id

          for (const child of childrens) {
            const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
            const { data, error } = await supabase
              .from('devoir')
              .select('* ,matiere(matiere_name), ensg( user_id, users(nom , prenom))')
              .eq('class_id', child.class_id)
              .order('created_at', { ascending: false });


              const CombinationObjects = data.map(item => ({
                class_id:item.class_id,
                date_debut:item.date_debut,
                date_fin:item.date_fin,
                title:item.title,
                description:item.description,
                eleve_id:item.eleve_id,
                ensg_id:item.ensg_id,
                devoir_id:item.id,
                matiere_id:item.matiere_id,
                matiere_name:item.matiere.matiere_name,
                ensg_nom:item.ensg.users.nom,
                ensg_prenom:item.ensg.users.prenom,
                id:item.id
                
               

              }));

         

            if (error) {
              throw error;
            }

            CombinationObjects.forEach(homework => {
              const homeworkObject = {
                ...homework,
                child_nom: child.nom,
                child_prenom: child.prenom,
               /*  num_eleve: child.num_eleve, */
                eleve_id: child.eleve_id
              };
              devoirs.push(homeworkObject);

            });
          }

            setHomeWorks(devoirs)

         
          } catch (error) {
            console.error('Error fetching child homeworks:', error.message);
          }
       

    }

      getHomeworks();

  }, [childrens])


  return (
    <div className=' py-8 pt-0  '>

   {/*    <h2 className='font-bold text-xl mb-6'> HomeWorks of your childrens </h2> */}

      <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        
          {
            HomeWorks.map((homeWork, index) => (
              <li style={{boxShadow:"rgba(99, 99, 99, 0.15) 0px 2px 8px 0px"}}   className=" bg-white p-1 border flex flex-col   text-[13px] rounded-xl " key={index}>
                           <div className='flex bg-grayBg rounded-lg flex-col gap-2 p-5 grow'>


                           <h2 className='font-semibold text-[16px]'> {homeWork.title} de "{homeWork.matiere_name}" </h2>
                           <p> {homeWork.description}</p>
                           <div className='flex gap-4 '>
                            <p><span className='font-medium text-green-600'>Date début :</span> {homeWork.date_debut}</p>
                            /
                            <p><span className='font-medium text-danger-600'>Date fin :</span> {homeWork.date_fin}</p>

                           </div>

                           <p className='text-[12px] mt-auto'><strong>Enseignant :</strong> {homeWork.ensg_nom} {homeWork.ensg_prenom}</p>

                           </div>

                           <p className=' w-full text-base text-center  bg-primaryColor rounded-lg  p-2 text-white mt-1 '>{homeWork.child_nom} {homeWork.child_prenom}  </p>

                          
                        </li>
            ))
          }
        
      </ul>

    </div>
  )
}

export default fetchDevoir