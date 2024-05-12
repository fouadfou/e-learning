"use client"

import React ,{useState , useEffect} from 'react'
import {  DatePicker  } from "antd"
import {Select,Chip, ModalContent,Input, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

import { CiSearch } from "react-icons/ci";
import { addyear, deleteYear, getYears } from '@/app/utils/yearControle';
import { useAuth } from '@clerk/nextjs';
import { GoPlus } from "react-icons/go";
import Yearelement from './Yearelement';
import {Spinner} from "@nextui-org/react";





const page = () => {


    const [years,setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [loading, setLoading] = useState(null);
    const [searchValue, setSearchValue] = useState('');





    const {userId, getToken } = useAuth();


    
    useEffect(() => {
      
        const fetchUsers = async () => {
          const token = await getToken({ template: "supabase" });
          const fetchedYears = await getYears({token }); // Fetch users data
          const sortedYears = fetchedYears.sort((a, b) => {
            // Convert year strings to numbers and compare
            return   parseInt(b.annee) - parseInt(a.annee);
        });

          setYears(sortedYears); // Update users state
          
      };
  
          if (userId ) {
              fetchUsers(); // Call fetchUsers only when user is signed in
          }
      }, [getToken, userId ]); // Include dependencies to ensure useEffect runs when they change

    

     useEffect(() => {
       console.log(selectedYear)
     }, [selectedYear])
      
     const insertYear = async () => {
        try {
            const token = await getToken({ template: "supabase" });
            setLoading(true);
            await addyear({ token,  selectedYear}); // Use selectedYear for year_name
            setSelectedYear(null);



            setTimeout(async() => {
                const fetchedYears = await getYears({token }); // Fetch users data
                const sortedYears = fetchedYears.sort((a, b) => {
                    // Convert year strings to numbers and compare
                    return   parseInt(b.annee) - parseInt(a.annee);
                });
                setYears(sortedYears); // Update users state
                setLoading(false);

                
            }, 200);

        } catch (error) {
            // Handle errors here
        } 
    };


   

    const filteredYears = years.filter(year => year.annee.includes(searchValue));
   
    
  return (
    <div className='p-8 flex flex-col gap-4'>

       {/* 
        <p className='font-medium '>Select School Year </p>
        <DatePicker  picker="year" /> */}

        <div className='flex gap-4'>
        
        <Input
            isClearable
            className="w-full sm:max-w-[60%]"
            placeholder="Search by year"
            startContent={<CiSearch />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
           /*  value={filterValue} */
            // onClear={() => onClear()}
            /* onValueChange={onSearchChange} */
          />

        <DatePicker
            picker="year"
             onChange={(dateString) => setSelectedYear(dateString ? new Date(dateString).getFullYear() : '')}  // Update selectedYear state with the chosen year
        />

        

        <Button
            onClick={insertYear} // Call insertYear function when button is clicked
            isDisabled={(selectedYear === null || selectedYear ==='') && true}
            className='bg-primaryColor text-white'
            endContent={<GoPlus/>}
        >
            Add Year
        </Button>
    
        </div>
        
        <h3 className='font-medium mt-6'>Manage scholl years table</h3>

        <div className='border-t-[1px]  '>

        {
    filteredYears.map((year , index) => (

        <div className='flex items-center justify-between gap-3 border-b-[1px] py-3 px-2' key={index}>
            <Yearelement year={year} setYears={setYears} index={index} getToken={getToken} />

        </div>
    ))
}

        </div>

        <div className="bg-grayBg rounded-xl flex justify-center p-4 font-medium" >
                
                        {loading ? <Spinner />  : ""}
                    
              
     </div>
        
    </div>
  )
}

export default page