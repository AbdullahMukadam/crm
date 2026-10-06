"use client"
import { CreatorSettingsItems } from '@/config/settingsConfig'
import { ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'

function SettingsClient() {
    const router = useRouter()
    const handleItemClick = useCallback((itemPath: string) => {
        router.push(itemPath)
    }, [])

    return (
        <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8'>
            <PageHeader title="Settings" description="Manage your account and preferences." />
            <div className='mt-6 divide-y divide-border rounded-xl border border-border bg-card'>
                {CreatorSettingsItems.map((item) => (
                    <button
                        key={item.href}
                        onClick={() => handleItemClick(item.href)}
                        className='group flex w-full items-center justify-between gap-4 p-4 text-left transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted/40'
                    >
                        <div className='min-w-0'>
                            <h2 className='text-sm font-medium'>{item.label}</h2>
                            <p className='mt-0.5 text-sm text-muted-foreground'>{item.description}</p>
                        </div>
                        <ChevronRight className='size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
                    </button>
                ))}
            </div>
        </div>
    )
}

export default SettingsClient