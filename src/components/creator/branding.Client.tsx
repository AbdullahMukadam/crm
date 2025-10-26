"use client"
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeadFormOptions } from '@/config/settingsConfig'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

function BrandingClient() {
    return (
        <div className='w-full'>
            <div className='w-full min-h-screen flex flex-col gap-5 mt-20 justify-start'>
                <h1 className='text-3xl'>Brand Settings</h1>
                <Tabs defaultValue="account" className="w-[60%]">
                    <TabsList>
                        <TabsTrigger value="lead-form">Lead Form</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="lead-form">
                        <div className='w-full p-2'>
                            <p className='text-gray-500 text-base'>Choose the Feilds Required for your Lead Form</p>
                            <div className='w-full flex flex-col'>
                                <div className='w-full flex items-center justify-between'>
                                    <h2 className='text-xl'>Feild Label</h2>
                                    <h2 className='text-xl'>Mapping to the Feild</h2>
                                </div>
                                <div className='w-full flex flex-col gap-4 mt-2'>
                                    {LeadFormOptions.map((lead) => {
                                        return (
                                            <div key={lead.label} className='w-full flex border border-gray-500 p-2 rounded-xl'>
                                                <div className='w-1/2 flex items-center gap-2'>
                                                    <h2 className='text-xl'>{lead.label}</h2>
                                                    {lead.required && <span className='bg-gray-500 text-white rounded-xl px-2'>Required</span>}
                                                </div>
                                                <div className='w-1/2'>
                                                    <h2 className='text-xl'>{lead.label}</h2>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="settings">Change your password here.</TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default BrandingClient