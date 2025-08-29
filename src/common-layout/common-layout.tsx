
import Navbar from '@/components/navbar'
import { Toaster } from '@/components/ui/sonner'
import React from 'react'

type Props = {
    children: React.ReactNode
}
function CommonLayout({ children }: Props) {
    return (
        <div className='w-full h-full bg-black'>
            <Navbar />
            <main className='w-full'>
                {children}
            </main>
            <Toaster />
        </div>
    )
}

export default CommonLayout