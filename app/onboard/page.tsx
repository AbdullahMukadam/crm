"use client"
import { useAppSelector } from '@/lib/store/hooks'
import React from 'react'

function Onboardpage() {
  const { username } = useAppSelector((state) => state.auth)

  return (
    <div className='w-full p-2 bg-zinc-950'>
      <h1 className='text-white'>Hii,{username}</h1>
    </div>
  )
}

export default Onboardpage