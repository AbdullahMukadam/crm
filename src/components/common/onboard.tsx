"use client"
import { useAppSelector } from '@/lib/store/hooks'
import React from 'react'

function Onboard() {
    const { onboarded } = useAppSelector((state) => state.auth)

    if(onboarded){
        return <div>User is already onboarded</div>
    }

    return (
        <div>onboard</div>
    )
}

export default Onboard