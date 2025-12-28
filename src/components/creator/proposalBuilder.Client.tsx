"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    pointerWithin,
    DragOverlay
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import { Block } from '@/types/proposal';
import { ProposalBuilderBlocks } from '@/config/proposalsBluiderConfig';
import { useProposal } from '@/hooks/useProposal';
import { Link, Loader2, Menu, X, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { saveProposal } from '@/lib/store/features/proposalsSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';

// Dynamic imports
const ProposalSidebar = dynamic(() => import('./proposalSidebar'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-zinc-900 animate-pulse" />
});

const ProposalCanvas = dynamic(() => import('./proposalCanvas'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center text-zinc-500">
            <Loader2 className="animate-spin h-8 w-8" />
        </div>
    )
});

function ProposalBuilderClient({ proposalId }: { proposalId: string }) {
    const { isLoading, proposalData } = useProposal({ proposalId })
    const {isLoading : isProposalLoading} = useAppSelector((state) => state.proposal)
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [activeBlock, setActiveBlock] = useState<Block | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isAutoSaveOn, setisAutoSaveOn] = useState(false)
    const [isCollapsed, setisCollapsed] = useState(false)
    const dispatch = useAppDispatch()


    // Mobile menu state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Sensors with touch optimization
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Prevents accidental drags on touch scrolling
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.type === 'sidebar-item') {
            setActiveBlock(active.data.current.item);
        } else if (active.data.current?.type === 'canvas-block') {
            setActiveBlock(active.data.current.block);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveBlock(null);
        // Close mobile menu if we dragged something from it
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);

        if (!over) return;

        const isSidebarItem = active.data.current?.type === 'sidebar-item';
        const isCanvasBlock = active.data.current?.type === 'canvas-block';

        // CASE 1: Adding a new block from sidebar to canvas
        if (isSidebarItem && over.id === 'canvas') {
            const newBlockTemplate = active.data.current?.item as Block;
            const newBlock: Block = {
                ...newBlockTemplate,
                id: `block-${Date.now()}-${nanoid(6)}`,
            };
            setBlocks((prev) => [...prev, newBlock]);
            toast.success("Block added to canvas");
            return;
        }

        // CASE 2: Reordering existing blocks on canvas
        if (isCanvasBlock) {
            const activeId = active.id;
            const overId = over.id;

            if (activeId !== overId) {
                setBlocks((items) => {
                    const oldIndex = items.findIndex((item) => item.id === activeId);
                    const newIndex = items.findIndex((item) => item.id === overId);
                    if (oldIndex === -1 || newIndex === -1) return items;
                    return arrayMove(items, oldIndex, newIndex);
                });
            }
        }
    };

    const handleCreateSharableLink = useCallback((proposalId: string) => {
        const url = process.env.NEXT_PUBLIC_APP_URL + `/proposals/viewer/${proposalId}`
        navigator.clipboard.writeText(url)
        toast.success("Link Copied Successfully")
    }, [])

    useEffect(() => {
        if (proposalData && !isInitialized) {
            setBlocks(proposalData.content || [])
            setIsInitialized(true)
        }
    }, [proposalData, isInitialized])

    const handleManualSave = useCallback(async () => {
        try {
            const response = await dispatch(saveProposal({
                blocks: blocks,
                proposalId: proposalId
            }))

            if (saveProposal.fulfilled.match(response)) {
                toast.success("Data Saved Successfully")
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "unable to save data")
        }
    }, [blocks])

    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100">
                <Loader2 className="animate-spin mb-4 h-10 w-10 text-primary" />
                <p className="uppercase tracking-widest text-xs font-semibold text-zinc-500 animate-pulse">Loading Proposal...</p>
            </div>
        )
    }

    return (
        <div className="w-full h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 flex flex-col overflow-hidden">
            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {/* Header - Fixed Top */}
                <header className='w-full px-4 sm:px-6 py-3 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center z-20 shadow-sm'>
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-zinc-400"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div>
                            <h1 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white hidden sm:block">
                                Proposal Builder
                            </h1>
                            <h1 className="text-lg font-bold uppercase tracking-tight text-white sm:hidden">
                                Builder
                            </h1>
                            <p className="text-zinc-500 text-[10px] sm:text-xs font-medium tracking-wide hidden sm:block">
                                Drag blocks to canvas &bull; Reorder freely
                            </p>
                        </div>
                    </div>

                    <div className='flex items-center gap-2 sm:gap-4'>
                        <Button

                            size="sm"
                            className=" hidden sm:flex gap-2"
                            onClick={() => handleManualSave()}
                            disabled={isProposalLoading}
                        >
                            {isLoading ? "saving.." : "Save"}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-zinc-400 hover:text-white hidden sm:flex gap-2"
                            onClick={() => handleCreateSharableLink(proposalId)}
                        >
                            <Link size={14} />
                            Share Link
                        </Button>

                        <div className="flex items-center gap-2 bg-zinc-800/50 rounded-full px-3 py-1.5 border border-zinc-800">
                            <div
                                className="relative inline-flex items-center cursor-pointer"
                                onClick={() => setisAutoSaveOn(prev => !prev)}
                            >
                                <input
                                    className="sr-only peer"
                                    type="checkbox"
                                    checked={isAutoSaveOn}
                                    readOnly
                                />
                                <div className="w-8 h-4 bg-zinc-700 rounded-full peer-checked:bg-emerald-500 transition-colors duration-200 ease-in-out"></div>
                                <div className="absolute left-0.5 top-0.5 bg-zinc-300 peer-checked:bg-white w-3 h-3 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-full shadow-sm"></div>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isAutoSaveOn ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                {isAutoSaveOn ? 'Auto-Save On' : 'Off'}
                            </span>
                        </div>

                        {/* Mobile Share Icon Only */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="sm:hidden text-zinc-400"
                            onClick={() => handleCreateSharableLink(proposalId)}
                        >
                            <Link className="h-5 w-5" />
                        </Button>
                    </div>
                </header>

                <div className="flex-grow flex overflow-hidden relative">
                    {/* Desktop Sidebar */}
                    <aside
                        className={cn(
                            "hidden md:block border-r border-zinc-800 bg-zinc-900 h-full overflow-y-auto shrink-0 z-10 transition-all duration-300 ease-in-out",
                            isCollapsed ? "w-[80px]" : "w-[280px] lg:w-[320px]" // Dynamic width here
                        )}
                    >
                        <ProposalSidebar
                            isCollapsed={isCollapsed}
                            setIsCollapsed={setisCollapsed}
                            sidebarDragableItems={ProposalBuilderBlocks}
                            activeBlock={activeBlock}
                        />
                    </aside>

                    {/* Mobile Sidebar (Overlay / Drawer) */}
                    {isMobileMenuOpen && (
                        <div className="absolute inset-0 z-50 flex md:hidden">
                            {/* Backdrop */}
                            <div
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                            {/* Drawer Content */}
                            <div className="relative w-[85%] max-w-[300px] bg-zinc-900 h-full border-r border-zinc-800 shadow-2xl animate-in slide-in-from-left duration-200">
                                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                                    <span className="font-semibold text-white">Blocks Library</span>
                                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                                <div className="h-[calc(100%-60px)] overflow-y-auto">
                                    <ProposalSidebar
                                        isCollapsed={false} // Always expanded on mobile
                                        setIsCollapsed={() => { }} // No collapse on mobile
                                        sidebarDragableItems={ProposalBuilderBlocks}
                                        activeBlock={activeBlock}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Canvas Area */}
                    <main className="flex-grow h-full overflow-hidden bg-zinc-950 relative">
                        {/* Scrollable Container */}
                        <div className="h-full overflow-y-auto overflow-x-hidden p-4 sm:p-8 custom-scrollbar">
                            <div className="max-w-4xl mx-auto min-h-[calc(100vh-100px)] pb-20">
                                <SortableContext
                                    items={blocks.map(b => b.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <ProposalCanvas
                                        blocks={blocks}
                                        setBlocks={setBlocks}
                                        proposalId={proposalId}
                                        isAutosaveOn={isAutoSaveOn}
                                    />
                                </SortableContext>

                                {/* Drop Zone Hint (Visible when empty) */}
                                {blocks.length === 0 && (
                                    <div className="mt-10 border-2 border-dashed border-zinc-800 rounded-xl p-10 text-center text-zinc-600">
                                        <p className="text-lg font-medium">Your canvas is empty</p>
                                        <p className="text-sm mt-1">Open the sidebar and drag a block here to start.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>

                {/* Drag Overlay - Optional but recommended for visual feedback during drag */}
                {/* <DragOverlay> ... </DragOverlay> */}
            </DndContext>
        </div>
    );
}

export default ProposalBuilderClient;