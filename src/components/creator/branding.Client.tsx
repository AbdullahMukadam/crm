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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { LeadFormUrlCreationDropdown } from './LeadFormUrlCreationDropdown'
import { Check, Copy, ExternalLink, Globe, Link as LinkIcon, Settings } from 'lucide-react' // Added Check, Globe, LinkIcon
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
    const [hasCopied, setHasCopied] = useState(false) // Added for copy feedback
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
                toast.success("Branding Updated Successfully")
                if (response.data?.url) {
                    setgeneratedUrl(response.data.url)
                }
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
        // Optional: clear previous url when selection changes
        // setgeneratedUrl("") 
    }

    const handleCopy = () => {
        if (!generatedUrl) return;
        navigator.clipboard.writeText(generatedUrl)
        setHasCopied(true)
        toast.success("Copied to clipboard")

        // Reset check icon after 2 seconds
        setTimeout(() => {
            setHasCopied(false)
        }, 2000)
    }

    const handleOpenLeadForm = () => {
        const url = `/lead-form/${user.username?.toLowerCase()}`
        router.push(url)
    }

    return (
        <div className='w-full min-h-screen p-4 sm:p-6 lg:p-8'>
            <div className='max-w-4xl mx-auto flex flex-col gap-6'>
                <div className="flex flex-col gap-2">
                    <h1 className='text-2xl sm:text-3xl font-semibold tracking-tight'>Brand Settings</h1>
                    <p className="text-sm text-muted-foreground">Manage your branding and lead form configurations.</p>
                </div>

                <Tabs defaultValue="lead-form" className="w-full">
                    <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex">
                        <TabsTrigger value="lead-form">Lead Form</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="lead-form" className="mt-6 space-y-6">
                        <div className='space-y-4'>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h3 className='text-lg font-medium'>Form Fields</h3>
                                <p className='text-sm text-muted-foreground'>
                                    Drag and drop to reorder fields
                                </p>
                            </div>

                            <div className='hidden sm:flex w-full items-center justify-between px-4 py-2 text-sm font-medium text-muted-foreground bg-muted/50 rounded-lg border border-border'>
                                <span>Field Label</span>
                                <span>Mapping</span>
                            </div>

                            <div className='space-y-3'>
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

                        <div className='flex justify-end pt-4 border-t'>
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full sm:w-auto"
                            >
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-6 space-y-4">
                        <div className='bg-card border border-border rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm'>
                            <div className="space-y-1">
                                <h4 className='font-medium text-card-foreground'>View Lead Form</h4>
                                <p className='text-sm text-muted-foreground'>Preview how your form looks to visitors</p>
                            </div>
                            <Button variant="outline" onClick={handleOpenLeadForm} className="shrink-0 gap-2">
                                <ExternalLink size={16} />
                                Open Form
                            </Button>
                        </div>

                        <div className='bg-card border border-border rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm'>
                            <div className="space-y-1">
                                <h4 className='font-medium text-card-foreground'>Public Lead Form URL</h4>
                                <p className='text-sm text-muted-foreground'>Generate a unique URL for your campaigns</p>
                            </div>
                            <Button onClick={() => setisModalOpen(true)} className="shrink-0 gap-2">
                                <Settings size={16} />
                                Generate URL
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* --- UPDATED DIALOG LAYOUT --- */}
                <Dialog open={isModalOpen} onOpenChange={setisModalOpen}>
                    <DialogContent className='w-full sm:max-w-md bg-zinc-950 text-zinc-100 border-zinc-800 p-0 gap-0 overflow-hidden'>

                        <div className="p-6 pb-4">
                            <DialogHeader>
                                <DialogTitle className="text-xl flex items-center gap-2">
                                    Create New URL
                                </DialogTitle>
                                <DialogDescription className="text-zinc-400 mt-2">
                                    Select a configuration option below to generate a trackable lead form link.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Configuration</label>
                                    <LeadFormUrlCreationDropdown
                                        handleSelect={handleSelect}
                                        selectedOption={selectedOption}
                                    />
                                </div>

                                {generatedUrl && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
                                            Generated Link
                                        </label>
                                        <div className='flex items-center gap-1 rounded-lg bg-zinc-900 border border-zinc-800 p-1 pl-3 transition-colors focus-within:ring-1 focus-within:ring-zinc-700'>
                                            <LinkIcon className="h-4 w-4 text-zinc-500 shrink-0" />
                                            <input
                                                readOnly
                                                value={generatedUrl}
                                                className="flex-1 bg-transparent border-none text-sm text-zinc-200 focus:outline-none placeholder:text-zinc-600 truncate py-2 font-mono"
                                            />
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={handleCopy}
                                                className="h-8 px-3 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                            >
                                                {hasCopied ? (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <p className="text-[11px] text-zinc-500 mt-2">
                                            Anyone with this link can access the specific lead form configuration.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="bg-zinc-900/50 p-6 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setisModalOpen(false)}
                                className="border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white w-full sm:w-auto"
                            >
                                Close
                            </Button>
                            <Button
                                variant="default"
                                onClick={handleGenerateUrl}
                                disabled={!selectedOption}
                                className=" w-full sm:w-auto"
                            >
                                Generate Link
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default BrandingClient