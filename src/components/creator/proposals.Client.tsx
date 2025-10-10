"use client"
import { FetchProposals } from '@/lib/store/features/proposalsSlice'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

function ProposalsClient() {
    const { proposals, isLoading } = useAppSelector((state) => state.proposal)
    const dispatch = useAppDispatch()
    const router = useRouter()

    useEffect(() => {
        if (proposals.length === 0) {
            dispatch(FetchProposals())
        }
    }, [])

    return (
        <div className='w-full h-screen p-6 font-brcolage-grotesque'>
            {isLoading && (
                <div className='w-full flex items-center justify-center'>
                    <span className='text-white text-3xl animate-bounce'>Loading...</span>
                </div>)}
            {!isLoading && proposals.length === 0 && (
                <div className='w-full h-full p-2 flex flex-col items-center justify-center'>
                    <h1 className='text-3xl text-white'>No Proposals Found</h1>
                    <p className='text-white mt-2'>You have not created any proposals yet.</p>
                    <Button onClick={() => router.push("/proposals/builder/123e4567-e89b-12d3-a456-426614174000")} variant="default" className='mt-3'>Create One <Plus /></Button>
                </div>
            )}
        </div>
    )
}

export default ProposalsClient