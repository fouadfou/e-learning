"use clinet"
import React, { useState } from 'react';
import { Input  } from '@nextui-org/react';

import FetchReleves from './FetchReleves';
import FetchTimetable from './FetchTimetable';

const ChildInfo = ({getToken}) => {

  const [num_student, setNum_student] = useState('');


  return (
    <div className='flex mt-4 flex-col  gap-4'>
        <Input
        value={num_student}
        onChange={(e) => setNum_student(e.target.value)}
        radius="lg"
        size="sm"
        label="Numéro d'élève"
        type="text"
        labelPlacement="inside"
        className='w-fit self-center'
      />
      
      <p className='text-sm font-medium self-center  text-gray-600'>Veuillez copier le numéro de l'enfant ci-dessus pour obtenir des informations.</p>

        <div className='border'>

        <FetchTimetable num_student={num_student} getToken={getToken} />

        <FetchReleves num_student={num_student} getToken={getToken} />
        </div>
      
    </div>
  )
}

export default ChildInfo;
