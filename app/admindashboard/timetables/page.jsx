"use clinet"

import React from 'react'
import UploadImage from './UploadImage'
import FileUpload from './FileUpload'


const page = () => {
  return (
    <div className="flex flex-col gap-8">
      <h1 className='font-bold text-xl w-full '>Ajouter les emplois du temps</h1>

         <UploadImage />
        
    </div>
  )
}

export default page