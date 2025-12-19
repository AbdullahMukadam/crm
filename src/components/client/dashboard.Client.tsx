"use client"
import { fetchProjects } from '@/lib/store/features/projectSlice'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { Card } from '../ui/card'
import { SectionCards } from './statusCards'

function ClientDashboard() {
  const { projects, isLoading, error, isUpdateLoading } = useAppSelector((state) => state.projects)
  const { username } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (projects.length === 0) dispatch(fetchProjects());
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-zinc-950 text-zinc-300">
        <Loader2 className="animate-spin mr-2" /> Loading dashboard...
      </div>
    );
  }

  return (
    <div className='w-full p-2 font-brcolage-grotesque'>
      <h1 className='text-4xl font-bold'>Welcome Back, {username}</h1>
      <div className='w-full flex items-center justify-center'>
        {projects.length === 0 && (
          <p className='text-zinc-700'>No Active Projects</p>
        )}
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <SectionCards />
          <div className='w-full'>

          </div>
        </div>
      </div>

    </div>
  )
}

export default ClientDashboard