"use client"
import React, { useCallback, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeadFormGenerationOptions, LeadFormOptions } from '@/config/settingsConfig'
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import LeadItem from '../ui/leadItem'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { FormDetails } from '@/types/branding'
import brandingService from '@/lib/api/brandingService'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../ui/dialog'
import { Card } from '../ui/card'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { LeadFormUrlCreationDropdown } from './LeadFormUrlCreationDropdown'
import { APIResponse } from '@/types/auth'
import { Copy } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hooks'
import { useRouter } from 'next/navigation'

export interface SelectedOption {
    id: string,
    Label: string
}


function BrandingClient() {
    const user = useAppSelector((state) => state.auth)
    const [items, setItems] = useState<FormDetails[]>(LeadFormOptions)
    const [isLoading, setisLoading] = useState(false)
    const [isModalOpen, setisModalOpen] = useState(false)
    const [selectedOption, setselectedOption] = useState<SelectedOption | null>(null)
    const [generatedUrl, setgeneratedUrl] = useState("")
    const router = useRouter()


    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        setItems((currentItems) => {

            const oldIndex = currentItems.findIndex((item) => item.id === activeId)
            const newIndex = currentItems.findIndex((item) => item.id === overId)

            return arrayMove(currentItems, oldIndex, newIndex)
        })
    }

    const handleSubmit = useCallback(async () => {
        try {
            setisLoading(true)
            setgeneratedUrl("")
            const response = await brandingService.createBranding({
                feilds: items
            })
            if (response.success) {
                toast.success("Brnading Updated Successfully")
                setgeneratedUrl(response.data.url)
            }
        } catch (error) {
            toast.error("Unable to Update the Order")
        } finally {
            setisLoading(false)
        }
    }, [items])

    const handleGenerateUrl = useCallback(async () => {
        if (!selectedOption) return;

        try {
            const response = await brandingService.generatePublicLeadFormUrl(selectedOption)
            if (response.success) {
                toast.success("Url generated Successfully")
                setgeneratedUrl(response.data as string)
            }
        } catch (error) {
            toast.error("Unable to generate the url")
        }
    }, [selectedOption])

    const handleSelect = (option: SelectedOption) => {
        setselectedOption(option)
    }

    const handleCopy = () => {
        if (!generatedUrl) return;

        navigator.clipboard.writeText(generatedUrl)
        toast.success("Coppied Successfully")
    }

    const handleOpenLeadForm = () => {
        const url = `/lead-form/${user.username?.toLowerCase()}`
        router.push(url)
    }

    return (
        <div className='w-full'>

            <div className='w-full min-h-screen flex flex-col gap-5 mt-6 justify-start'>
                <h1 className='text-3xl'>Brand Settings</h1>
                <Tabs defaultValue="lead-form" className=" w-full md:w-[60%]">
                    <TabsList>
                        <TabsTrigger value="lead-form">Lead Form</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="lead-form">
                        <div className='w-full p-2'>
                            <p className='text-gray-500 text-base'>Choose the Feilds Required for your Lead Form</p>
                            <div className='w-full flex flex-col mt-3'>
                                <div className='w-full flex items-center justify-between'>
                                    <h2 className='text-xl'>Feild Label</h2>
                                    <h2 className='text-xl'>Mapping to the Feild</h2>
                                </div>
                                <div className='w-full flex flex-col gap-4 mt-2'>
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext items={items} strategy={verticalListSortingStrategy}>
                                            {items.map((lead) => (
                                                <LeadItem lead={lead} key={lead.id} id={lead.id} />
                                            ))}
                                        </SortableContext>
                                    </DndContext>
                                </div>
                            </div>
                            <div className='w-full flex justify-end mt-5'>
                                <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? "Saving.." : "Save Order"}</Button>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="settings">
                        <div className='w-full p-2 mt-4 rounded-md flex items-center justify-between bg-zinc-900 border border-zinc-800'>
                            <p className='text-white'>View your Lead Form</p>
                            <Button variant="destructive" onClick={handleOpenLeadForm}>Open</Button>
                        </div>

                        <div className='w-full p-2 mt-4 rounded-md flex items-center justify-between bg-zinc-900 border border-zinc-800'>
                            <p className='text-white'>Generate your Lead Form Url</p>
                            <Button variant="destructive" onClick={() => setisModalOpen((prev) => !prev)}>Open</Button>
                        </div>
                    </TabsContent>
                </Tabs>
                <Dialog open={isModalOpen} onOpenChange={setisModalOpen}>
                    <DialogContent className='sm:max-w-[400px] bg-zinc-900 text-zinc-100 border border-zinc-700'>
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">
                                Create New Url
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                PLease Select an Option
                            </DialogDescription>
                        </DialogHeader>

                        <LeadFormUrlCreationDropdown handleSelect={handleSelect} selectedOption={selectedOption} />
                        {generatedUrl && (
                            <div className='w-full rounded-xl bg-zinc-700 text-white flex justify-between items-center p-3'>
                                <p>{generatedUrl}</p>
                                <Copy onClick={handleCopy} />
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="destructive" onClick={handleGenerateUrl}>Generate Url</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

        </div>
    )
}

export default BrandingClient