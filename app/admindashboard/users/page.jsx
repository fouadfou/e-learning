import React from 'react'
import { Button } from '@nextui-org/react'
import { auth, clerkClient } from "@clerk/nextjs";
import TableData from './TableData';
import ActionButton from './ActionButton';

const page = () => {

  
  return (
    <div  className="flex-1 p-8 " >
        <TableData>
          <ActionButton />
        </TableData>
    </div>
  )
}

export default page