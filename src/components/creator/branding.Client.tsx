"use client"
import React, { useCallback, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeadFormOptions } from '@/config/settingsConfig'
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import LeadItem from '../ui/leadItem'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { FormDetails } from '@/types/branding'
import brandingService from '@/lib/api/brandingService'



function BrandingClient() {
    const [items, setItems] = useState<FormDetails[]>(LeadFormOptions)
    const [isLoading, setisLoading] = useState(false)


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
            const response = await brandingService.createBranding({
                feilds: items
            })
            if (response.success) {
                toast.success("Brnading Updated Successfully")
            }
        } catch (error) {
            toast.error("Unable to Update the Order")
        } finally {
            setisLoading(false)
        }
    }, [items])

    return (
        <div className='w-full'>

            <div className='w-full min-h-screen flex flex-col gap-5 mt-20 justify-start'>
                <h1 className='text-3xl'>Brand Settings</h1>
                <Tabs defaultValue="lead-form" className="w-[60%]">
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
                                <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? "Save Order" : "Saving.."}</Button>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="settings">Get sharable link of Lead Form</TabsContent>
                </Tabs>
            </div>

        </div>
    )
}

export default BrandingClient