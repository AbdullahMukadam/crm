"use client"
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { authService } from '@/lib/api/authService'
import { UserRole } from '@/types/auth'
import { addUserDetails } from '@/lib/store/features/authSlice'

function Onboardpage() {
    const { onboarded, id } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()
    const [role, setRole] = useState<UserRole>("client")
    const [loading, setloading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!role) {
            toast.error("Please select a role")
            return
        }

        if (!id) {
            toast.error("User not found")
            return
        }
        setloading(true)

        try {
            const response = await authService.onboarding({
                role: role,
                userId: id
            })
            if (response.success && response.data) {
                dispatch(addUserDetails(response.data))
                toast.success("User onboarded successfully")
                router.push("/dashboard")
            }
        } catch (error) {
            toast.error("Failed to onboard user")
            console.error(error)
        } finally {
            setloading(false)
        }
    }



    useEffect(() => {
        if (onboarded) {
            router.push("/dashboard")
        }
    }, [onboarded, router])

    return (
        <div className='w-full p-2 flex items-center justify-center'>
            <Card className="w-full p-6 lg:max-w-[500px] font-brcolage-grotesque bg-transparent text-white border-none">
                <CardHeader>
                    <CardTitle className='text-xl'>Please fill the details</CardTitle>
                    <CardDescription>
                        Specify whether you are a Client or Freelancer.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Select defaultValue={role} onValueChange={(value) => setRole(value as UserRole)}>
                                    <SelectTrigger className="w-full border-[1px] border-white/25">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-zinc-900 text-white border-[1px] border-white/25'>
                                        <SelectGroup>
                                            <SelectLabel>Select</SelectLabel>
                                            <SelectItem value="client">Client</SelectItem>
                                            <SelectItem value="creator">Freelancer</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className='w-full pt-6'>
                            <Button type="submit" className="w-full" disabled={loading}>
                                Submit
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Onboardpage