
import { AuthInitializer } from '@/components/common/authInitializer'
import Navbar from '@/components/navbar'
import { Toaster } from '@/components/ui/sonner'
import ReduxProvider from '@/providers/ReduxProvider'
import React from 'react'

type Props = {
    children: React.ReactNode
}
function CommonLayout({ children }: Props) {
    return (
        <ReduxProvider>
            <AuthInitializer>
                <div className='w-full h-full bg-black'>
                    <Navbar />
                    <main className='w-full'>
                        {children}
                    </main>
                    <Toaster />
                </div>
            </AuthInitializer>

        </ReduxProvider>

    )
}

export default CommonLayout