
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
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
            <Footer />
        </div>
    )
}

export default CommonLayout