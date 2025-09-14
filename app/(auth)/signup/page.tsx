import AuthenticationForm from '@/components/form/form'
import React from 'react'

function SignUpPage() {

  return (
    <div className='w-full h-screen bg-zinc-950 p-4 overflow-hidden flex items-center justify-center'>
      <AuthenticationForm headerText='Create your Account' TypeofTheForm='Signup' />
    </div>
  )
}

export default SignUpPage