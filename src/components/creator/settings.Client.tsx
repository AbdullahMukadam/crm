"use client"
import { CreatorSettingsItems } from '@/config/settingsConfig'
import { MoveRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'

function SettingsClient() {
    const router = useRouter()
    const handleItemClick = useCallback((itemPath: string) => {
        router.push(itemPath)
    }, [])

    return (
        <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8'>
            <div className='mb-8 space-y-1'>
                <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Settings</h1>
                <p className='text-sm text-muted-foreground'>Manage your account settings and preferences.</p>
            </div>
            <div className='rounded-xl border border-border bg-card'>
                {CreatorSettingsItems.map((item, index) => (
                    <div key={index} onClick={() => handleItemClick(item.href)} className='hover:cursor-pointer w-full p-4 sm:p-5 flex items-center justify-between hover:bg-accent/50 transition-colors'>
                        <div className='w-[70%]'>
                            <h2 className='text-base font-medium mb-1'>{item.label}</h2>
                            <p className='text-sm text-muted-foreground'>{item.description}</p>
                        </div>
                        <div className='w-[30%] flex justify-end text-muted-foreground'>
                            <MoveRight size={20} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SettingsClient