"use client"
import brandingService from '@/lib/api/brandingService'
import { fetchBrandingResponse, FormFeild, LeadFormData } from '@/types/branding'
import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Card } from './card'
import { Input } from './input'
import { Label } from './label'
import { Button } from './button'

interface LeadForm {
    username: string
}
function LeadForm({ username }: LeadForm) {
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [brnadingData, setbrnadingData] = useState<FormFeild[] | null>(null)
    const [isLoading, setisLoading] = useState(false)

    const handlefetchBranding = useCallback(async () => {
        try {
            setisLoading(true)
            const response = await brandingService.fetchBranding()
            if (response.success && response.data) {
                setbrnadingData(response.data.formFeilds)

                toast.success("Successfully fetch the response")
            }
        } catch (error) {
            toast.error("Unable to fetch Response")
        } finally {
            setisLoading(false)
        }
    }, [])

    const handleLeadSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setisLoading(true)
            const payload = {
                ...formData,
                username: username
            }
            const response = await brandingService.createLead(payload)
            if (response.success && response.data) {
                toast.success("Successfully Create the Lead")
            }
        } catch (error) {
            toast.error("Unable to submit Lead")
        } finally {
            setisLoading(false)
            if (brnadingData) {
                const initial: Record<string, string> = {};
                brnadingData.forEach(f => initial[f.id] = "");
                setFormData(initial);
            }
        }
    }, [formData, username, brnadingData])

    useEffect(() => {
        if (brnadingData) {
            const initialState: Record<string, string> = {};
            brnadingData.forEach(f => initialState[f.id] = "");
            setFormData(initialState);
        }
    }, [brnadingData]);


    useEffect(() => {
        handlefetchBranding()
    }, [])

    return (
        <div className='w-full h-full flex items-center justify-center'>
            {isLoading ? (
                <p className='animate-bounce'>Please wait</p>
            ) : (
                <Card className='h-fit p-10 w-[30%]'>
                    <form onSubmit={handleLeadSubmit}>
                        {brnadingData ? (
                            brnadingData?.map((feild: FormFeild, i) => (
                                <div key={feild.id} className='w-full'>
                                    <Label className='text-black my-2'>{feild.mapping}</Label>
                                    <Input value={formData[feild.id] ?? ""} placeholder={feild.label} required={feild.required} onChange={(e) =>
                                        setFormData(prev => ({ ...prev, [feild.id]: e.target.value }))
                                    } />
                                </div>
                            ))
                        ) : (
                            <p>Please fill the data in Branding</p>
                        )}
                        <Button className='mt-4' type='submit'>Submit</Button>
                    </form>
                </Card>
            )
            }

        </div >
    )
}

export default LeadForm