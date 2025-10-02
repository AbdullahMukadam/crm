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
        <div className='w-full p-6 text-white font-brcolage-grotesque'>
            <h1 className='font-bold text-4xl'>Settings</h1>
            <p className='text-gray-400 mb-8'>Manage your account settings and preferences.</p>
            {CreatorSettingsItems.map((item, index) => (
                <div key={index} onClick={() => handleItemClick(item.href)} className='hover:cursor-pointer w-full p-4 border-b border-gray-400 flex items-center justify-between'>
                    <div className='w-[70%]'>
                        <h2 className='text-2xl font-bold mb-2 text-white'>{item.label}</h2>
                        <p className='text-gray-400 mb-4'>{item.description}</p>
                    </div>
                    <div className='w-[30%] flex justify-end'>
                        <MoveRight className='hover:scale-x-50 transition-all ease-in-out duration-200' size={20} color='white' />
                    </div>

                </div>
            ))}
        </div>
    )
}

export default SettingsClient