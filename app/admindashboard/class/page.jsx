"use client"
import React, { useState, useEffect } from 'react';
/* import { Select, SelectItem, Button, Input } from '@nextui-org/react';
import { supabaseClient } from '@/app/utils/supabaseClient';
import { useAuth } from '@clerk/nextjs' */;

import AddClass from './AddClass';
import JoinClass from './JoinClass';


const page = () => {



 
  const [classes , setClasses] = useState([]);


  return (
    <div className="flex-1 p-8 flex flex-col gap-4">
       <JoinClass classes={classes} setClasses={setClasses} />
       <AddClass classes={classes} setClasses={setClasses} />

    </div>
  )
}

export default page