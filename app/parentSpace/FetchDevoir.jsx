"use client"
import React , {useState , useEffect} from 'react'
import { supabaseClient } from '../utils/supabaseClient';
import { FaChild } from "react-icons/fa6";


const fetchDevoir = ({getToken , childrens , notifiedPages}) => {

  const [HomeWorks , setHomeWorks] = useState([]);

  useEffect(() => {

    const getHomeworks = async () => {
         
         const devoirs = [];

         for (const child of childrens) {

          try {

            // Fetch homeworks based on class_id


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

            setHomeWorks(devoirs)
          } catch (error) {
            console.error('Error fetching child homeworks:', error.message);
          }
        }

    }

      getHomeworks();

  }, [childrens])

/* 
  const getNewHomeWork = async (classId, child_nom, child_prenom , devoir_id ) => {
    try {
      const token = await getToken({ template: 'supabase' });
      const supabase = await supabaseClient(token);
      const { data, error } = await supabase
        .from('devoir')
        .select('* ,matiere(matiere_name), ensg( user_id, users(nom , prenom))')
        .eq('class_id', classId)
        .eq('id',devoir_id)
  
      const CombinationObjects = data.map(item => ({
        class_id: item.class_id,
        date_debut: item.date_debut,
        date_fin: item.date_fin,
        title: item.title,
        description: item.description,
        eleve_id: item.eleve_id,
        ensg_id: item.ensg_id,
        devoir_id: item.id,
        matiere_id: item.matiere_id,
        matiere_name: item.matiere.matiere_name,
        ensg_nom: item.ensg.users.nom,
        ensg_prenom: item.ensg.users.prenom,
        child_nom: child_nom,
        child_prenom: child_prenom,
      }));


  
      setHomeWorks((prevHomeWorks) =>  {
      
        return [...prevHomeWorks, ...CombinationObjects]
      });



    } catch (error) {
      console.error('Error fetching new homeworks:', error.message);
    }
  }

  

console.log("homewokrs", HomeWorks)


  useEffect(() => {

    const setupDevoirChannel = async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);

        const handleInserts = async(payload ) => {  

              console.log('New devoir inserted:', payload.new);

              console.log("childrens" , childrens)
              
              const childrensWithMatchingClass = childrens.filter(child => child.class_id == payload.new.class_id);
              console.log("childrensWithMatchingClass",childrensWithMatchingClass)

      if (childrensWithMatchingClass.length > 0) {

         for( const child of childrensWithMatchingClass ){
          

          getNewHomeWork(child.class_id, child.nom, child.prenom , payload.new.id)
          
        } 


     setHomeWorks((prevHomeworks) => {
          // Remove any existing homework with the same ID
          const updatedHomeworks = prevHomeworks.filter((devoir) => devoir.id !== payload.new.id);
          // Add the new homework
          return [...updatedHomeworks, payload.new];
        });  
        };
        }

        const handleDeletes = (payload) => {
          console.log('Devoir deleted:', payload.old);
        
          setHomeWorks((prevHomeworks) =>
            prevHomeworks.filter((devoir) => devoir.id != payload.old.id)
          );
        };
    
        supabase
          .channel('devoir_channel')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'devoir' }, handleInserts)
          .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'devoir' }, handleDeletes)

          .subscribe();


          
      } catch (error) {
        console.error('Error setting up devoir channel:', error.message);
      }
    };

    setupDevoirChannel();
  }, [childrens]);

 */



  return (
    <div className=' py-8 pt-0  '>

   {/*    <h2 className='font-bold text-xl mb-6'> HomeWorks of your childrens </h2> */}

      <ul className='grid grid-cols-cards gap-4'>
        
          {
            HomeWorks.map((homeWork, index) => (
              <li style={{boxShadow:"rgba(99, 99, 99, 0.15) 0px 2px 8px 0px"}}  className=" bg-white p-1 border  text-[13px] rounded-xl " key={index}>
                           <div className='flex bg-grayBg rounded-lg flex-col gap-2 p-5'>


                           <h2 className='font-semibold text-[16px]'> {homeWork.title} de "{homeWork.matiere_name}" </h2>
                           <p> {homeWork.description}</p>
                           <div className='flex gap-4 '>
                            <p><span className='font-medium text-green-600'>Date début :</span> {homeWork.date_debut}</p>
                            /
                            <p><span className='font-medium text-danger-600'>Date fin :</span> {homeWork.date_fin}</p>

                           </div>

                           <p className='text-[12px]'>Teacher : {homeWork.ensg_nom} {homeWork.ensg_prenom}</p>

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