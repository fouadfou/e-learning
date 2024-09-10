"use client"
import React, { useState , useEffect } from 'react'
import AddSubject from './AddSubject'
import JoinMatieres from './JoinMatieres';
import { useAuth } from '@clerk/nextjs';
import { supabaseClient } from '@/app/utils/supabaseClient';



const page = () => {

  const { getToken } = useAuth();

  const [matieres , setMatieres] = useState([])




  return (
    <div className="flex flex-col gap-8">
        <JoinMatieres getToken={getToken} matieres={matieres}  />
        <AddSubject getToken={getToken} matieres={matieres} setMatieres={setMatieres} />
    </div>
  )
}

export default page