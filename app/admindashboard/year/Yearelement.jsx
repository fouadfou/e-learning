
import React ,{useState} from 'react'
import {updateYear , deleteYear, getYears } from '@/app/utils/yearControle';
import { Chip , Input , Button } from '@nextui-org/react';
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import {  DatePicker  } from "antd"



const Yearelement = ({year , setYears , index , getToken}) => {
    
    const [update_Year , setUpdate_Year] = useState('');


    const delete_year = async (id) => {
        try {

            const token = await getToken({ template: "supabase" });
            await deleteYear({ token,  id}); 

            setTimeout(async() => {
                const fetchedYears = await getYears({token }); // Fetch users data
                const sortedYears = fetchedYears.sort((a, b) => {
                    // Convert year strings to numbers and compare
                    return   parseInt(b.annee) - parseInt(a.annee);
                });
                setYears(sortedYears); // Update users state
            }, 200);
        } catch (error) {
            // Handle errors here
        } 
    };


    const updateYearFunction = async(id , update_Year)=> {
        
            try {
                const token = await getToken({ template: "supabase" });
                await updateYear({ token,  id , update_Year}); 
                setUpdate_Year("");

                setTimeout(async() => {
                    const fetchedYears = await getYears({token }); 
                    const sortedYears = fetchedYears.sort((a, b) => {
                        // Convert year strings to numbers and compare
                        return   parseInt(b.annee) - parseInt(a.annee);
                    });
                    setYears(sortedYears); // Update users state
                }, 200);
                
            } catch (error) {
                
            }
    
        }

  return (
    <>
          <Chip
        className='bg-primaryColor text-white p-2'
        key={index}
      >
        {year.annee}
      </Chip>
           

            <DatePicker
            picker="year"
            placeholder="Année"
            width={300}
            onChange={(dateString) => setUpdate_Year(dateString ? new Date(dateString).getFullYear() : '')} // Update selectedYear state with the chosen year
            />

           

            <Button isDisabled={update_Year === ''} onClick={() => updateYearFunction(year.id, update_Year)} className="bg-transparent" isIconOnly>
                    <FiEdit />
                </Button>
            <Button  onClick={() => delete_year(year.id)}  className="bg-transparent" isIconOnly>
                <MdDelete   className="text-base text-danger-400 cursor-pointer"/>
            </Button>
    </>
  )
}

export default Yearelement