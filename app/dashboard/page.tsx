"use client"
import { useAppSelector } from '@/lib/store/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function page() {
    const { username, role, onboarded } = useAppSelector((state) => state.auth)
    const router = useRouter()

    useEffect(() => {
        if (onboarded) {
            router.push(`/dashboard/${role}`)
        }
    }, [onboarded])
    return (
        <div className='text-white'>
            <h1 className='text-2xl font-bold'>Welcome to your Dashboard</h1>
            <p className='text-lg mt-2'>Hello, {username}! You are logged in as a {role}.</p>
            {onboarded ? (
                <p className='mt-4 text-green-600 font-semibold'>You have completed the onboarding process.</p>
            ) : (
                <p className='mt-4 text-red-600 font-semibold'>Please complete the onboarding process.</p>
            )}
        </div>
    )
}

export default page