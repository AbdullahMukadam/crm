"use client"
import { useAppSelector } from '@/lib/store/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function page() {
    const { username, role, onboarded } = useAppSelector((state) => state.auth)
    const router = useRouter()

    useEffect(() => {
        if (onboarded) {
            router.push(`/dashboard/${role?.toLowerCase()}`)
        }
    }, [onboarded])
    return null;
}

export default page