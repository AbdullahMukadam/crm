"use client"
import brandingService from '@/lib/api/brandingService'
import { fetchBrandingResponse, FormFeild, LeadFormData } from '@/types/branding'
import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Card } from './card'
import { Input } from './input'
import { Label } from './label'
import { Button } from './button'
import { Loader2 } from 'lucide-react'

interface LeadFormProps {
    username: string
}

function LeadForm({ username }: LeadFormProps) {
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [brnadingData, setbrnadingData] = useState<FormFeild[] | null>(null)
    const [isLoading, setisLoading] = useState(false)

    const handlefetchBranding = useCallback(async () => {
        try {
            setisLoading(true)
            const response = await brandingService.fetchBranding(username)
            if (response.success && response.data) {
                setbrnadingData(response.data.formFeilds)
                // toast.success("Successfully fetch the response") // Optional: reduced noise
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
        <div className='w-full h-full flex items-center justify-center p-4'>
            {isLoading && !brnadingData ? (
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                    <Loader2 className='animate-spin w-8 h-8 text-indigo-500' />
                    <p className="text-sm">Loading form...</p>
                </div>
            ) : (
                <Card className='w-full max-w-md bg-zinc-950/80 backdrop-blur-sm border-zinc-800 shadow-2xl p-8'>
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Get in Touch</h2>
                        <p className="text-zinc-400 text-sm mt-2">
                            Fill out the form below and we'll get back to you.
                        </p>
                    </div>

                    <form onSubmit={handleLeadSubmit} className="space-y-5">
                        {brnadingData ? (
                            brnadingData?.map((feild: FormFeild, i) => (
                                <div key={feild.id} className='w-full space-y-2'>
                                    <Label className='text-zinc-300 font-medium text-sm ml-1'>
                                        {feild.mapping}
                                    </Label>
                                    <Input 
                                        value={formData[feild.id] ?? ""} 
                                        placeholder={feild.label} 
                                        required={feild.required} 
                                        className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 h-11"
                                        onChange={(e) =>
                                            setFormData(prev => ({ ...prev, [feild.id]: e.target.value }))
                                        } 
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                                <p>No form configuration found.</p>
                            </div>
                        )}
                        
                        <Button 
                            className='w-full mt-6 text-white font-medium h-11' 
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            Submit Request
                        </Button>
                    </form>
                </Card>
            )}
        </div>
    )
}

export default LeadForm