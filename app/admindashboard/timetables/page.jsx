"use clinet"

import React from 'react'
import UploadImage from './UploadImage'
import FileUpload from './FileUpload'


const page = () => {
  return (
    <div className="flex-1 p-8 flex flex-col gap-8">
         <UploadImage />
        
    </div>
  )
}

export default page