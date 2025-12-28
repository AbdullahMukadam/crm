import AuthenticationForm from '@/components/common/form'
import React from 'react'

function SignUpPage() {

  return (
    <div className='w-full h-screen bg-background p-4 overflow-hidden flex items-center justify-center'>
      <AuthenticationForm headerText='Create your Account' TypeofTheForm='Signup' />
    </div>
  )
}

export default SignUpPage