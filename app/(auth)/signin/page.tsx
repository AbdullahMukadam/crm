import AuthenticationForm from '@/components/common/form'
import React from 'react'

function SignInPage() {
  return (
    <div className='w-full h-screen bg-background p-4 overflow-hidden flex items-center justify-center'>
      <AuthenticationForm headerText='Login to your Account' TypeofTheForm='SignIn' />
    </div>
  )
}

export default SignInPage