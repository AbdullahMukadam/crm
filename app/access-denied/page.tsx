import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div className='font-bold text-4xl w-full h-[100vh] flex flex-col items-center justify-center text-white'>
        <h1>Access Denied</h1>
        <Link href='/dashboard' className='text-blue-500 underline ml-4'>Go Back to Your Dashboard</Link>
    </div>
  )
}

export default page