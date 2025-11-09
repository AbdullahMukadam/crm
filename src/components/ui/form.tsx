"use client"
import brandingService from '@/lib/api/brandingService'
import { fetchBrandingResponse, FormFeild } from '@/types/branding'
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
    const [formData, setformData] = useState([])
    const [brnadingData, setbrnadingData] = useState<FormFeild[] | null>(null)
    const [isLoading, setisLoading] = useState(false)

    const handlefetchBranding = useCallback(async () => {
        try {
            setisLoading(true)
            const response = await brandingService.fetchBranding()
            if (response.success && response.data) {
                setbrnadingData(response.data.formFeilds)
                console.log(response.data.formFeilds)
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
            const response = await brandingService.fetchBranding()
            if (response.success && response.data) {
                setbrnadingData(response.data.formFeilds)
                console.log(response.data.formFeilds)
                toast.success("Successfully fetch the response")
            }
        } catch (error) {
            toast.error("Unable to fetch Response")
        } finally {
            setisLoading(false)
        }
    }, [])

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
                            brnadingData?.map((feild: FormFeild) => (
                                <div key={feild.id} className='w-full'>
                                    <Label className='text-black my-2'>{feild.mapping}</Label>
                                    <Input placeholder={feild.label} required={feild.required} />
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