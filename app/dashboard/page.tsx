"use client"
import { useAppSelector } from '@/lib/store/hooks'
import { Loader2 } from 'lucide-react'
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
    return (
        <div className="w-full h-screen flex items-center justify-center bg-zinc-950 text-zinc-300">
            <Loader2 className="animate-spin mr-2" /> Please wait...
        </div>
    );
}

export default page