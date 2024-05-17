"use client"
import React, { useState, useEffect } from 'react';
import { Input, Button , Select, SelectItem } from '@nextui-org/react';
import { supabaseClient } from '@/app/utils/supabaseClient';


const FetchReleves = ({getToken , num_student}) => {
    
    const [selectedYear , setSelectedYear] = useState(null);
    const [years, setYears]  = useState([]);
    const [trimestres , setTrimestres] =  useState([]);
    const [selectedtrimestre , setSelectedtrimestre] = useState(null);
    const [releve , setReleve] = useState(null);

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

      const getReleve = async() => {

        if (num_student !== "" ) {
  
        try {

          releve !== null && setReleve(null)

          const token = await getToken({ template: 'supabase' });
            const supabase = await supabaseClient(token);
            const { data, error } = await supabase
            .from("releves")
            .select("releve ,eleve( num_eleve)")
            .eq("eleve.num_eleve",num_student)
            .eq("trimestre_id" , selectedtrimestre)
  
  
            
            setReleve(data[0].releve);
          
        } catch (error) {
          console.error('Error fetch timetable:', error.message);
        }
  
      }
      };
      
  return (
    <div className='w-full flex flex-col gap-4 items-center border-b py-8'>

      <div className='w-full flex justify-center  gap-4'>
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

      <Select 
         isDisabled={selectedYear === null}
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
      </Select>
      </div>
      <Button onClick={() => getReleve()} size='sm' className='bg-primaryColor w-[56%]  text-white'> Obetnir relevé</Button>

      
      {releve && (
        <embed src={releve} type="application/pdf" width="80%" height="400px" />
      )}
    </div>
  )
}

export default FetchReleves