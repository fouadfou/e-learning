import React from 'react'
import { FileInput, Label } from "flowbite-react";

const FileUpload = () => {
  return (
    <div>
    <div className="mb-2 block">
      <Label htmlFor="file-upload" value="Upload file" />
    </div>
    <FileInput  id="file-upload" />
  </div>
  )
}

export default FileUpload