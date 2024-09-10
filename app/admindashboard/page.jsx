

import { clerkClient } from '@clerk/nextjs'
import React from 'react'
import Link from 'next/link';


const page = async () => {

    const totalUsers = await clerkClient.users.getCount();
    
  return (
    <div className='flex  flex-col gap-6 '>
    <h1  className='text-2xl font-semibold'>Félicitations, votre application a maintenant des utilisateurs !</h1>

    <div >
      <Link href="/admindashboard/users">
      <div style={{boxShadow:"rgba(0, 0, 0, 0.04) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px"}} className='border-[1px]  rounded-2xl w-fit p-6 pr-14 cursor-pointer'>
        <p className=' font-semibold mb-1'>Total des utilisateurs</p>
        <p className='text-gray-500 text-sm font-medium mb-2'>Tous les temps</p>
        <p className='text-lg font-medium'>{totalUsers}</p>
        </div>
        </Link>
    </div>
</div>

  )
}

export default page