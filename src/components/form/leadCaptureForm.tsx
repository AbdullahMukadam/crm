
import React from 'react'
import { LoginForm } from '../ui/form'
import brandingService from '@/lib/api/brandingService';

interface LeadCaptureFormProps {
  username: string
}
function LeadCaptureForm({ username }: LeadCaptureFormProps) {
  let data;

  (async () => {
    const response = await brandingService.fetchBranding()
    data = response
  })
  return (
    <div className='w-full bg-zinc-900 h-screen flex items-center justify-center text-white'>
      <LoginForm className='w-[30%]' data={data} />
    </div>
  )
}

export default LeadCaptureForm