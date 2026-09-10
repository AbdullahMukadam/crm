"use client";

import { useCallback, useEffect, useState } from 'react';
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
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import { Block } from '@/types/proposal';
import { ProposalBuilderBlocks } from '@/config/proposalsBluiderConfig';
import { useProposal } from '@/hooks/useProposal';
import { Link, Loader2, Menu, X, Save, LayoutTemplate } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { saveProposal } from '@/lib/store/features/proposalsSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';

// Dynamic imports
const ProposalSidebar = dynamic(() => import('./proposalSidebar'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-card animate-pulse" />
});

const ProposalCanvas = dynamic(() => import('./proposalCanvas'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Loader2 className="animate-spin h-8 w-8" />
        </div>
    )
});

function ProposalBuilderClient({ proposalId }: { proposalId: string }) {
    const { isLoading, proposalData } = useProposal({ proposalId })
    const { isLoading: isProposalLoading } = useAppSelector((state) => state.proposal)
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
            <div className="w-full h-screen flex flex-col items-center justify-center bg-background text-foreground">
                <Loader2 className="animate-spin mb-4 h-10 w-10 text-primary" />
                <p className="uppercase tracking-widest text-xs font-semibold text-muted-foreground animate-pulse">Loading Proposal...</p>
            </div>
        )
    }

    return (
        <div className="w-full h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col overflow-hidden">
            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {/* Header - Fixed Top */}
                <header className='w-full px-4 sm:px-6 py-3 border-b border-border bg-background/95 backdrop-blur flex justify-between items-center z-20'>
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-muted-foreground"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="hidden sm:block">
                            <h1 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-foreground">
                                Proposal Builder
                            </h1>
                            <p className="text-muted-foreground text-[10px] sm:text-xs font-medium tracking-wide">
                                Drag blocks to canvas &bull; Reorder freely
                            </p>
                        </div>

                        <span className="sm:hidden text-lg font-bold uppercase tracking-tight text-foreground">
                            Builder
                        </span>
                    </div>

                    <div className='flex items-center gap-2 sm:gap-4'>
                        <Button
                            size="sm"
                            className="hidden sm:flex gap-2"
                            onClick={() => handleManualSave()}
                            disabled={isProposalLoading}
                        >
                            {isProposalLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save
                                </>
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground hidden sm:flex gap-2"
                            onClick={() => handleCreateSharableLink(proposalId)}
                        >
                            <Link size={14} />
                            Share Link
                        </Button>

                        <div className="flex items-center gap-2.5 rounded-full bg-muted/50 border border-border px-3 py-1.5">
                            <button
                                type="button"
                                role="switch"
                                aria-checked={isAutoSaveOn}
                                aria-label="Toggle auto-save"
                                className={cn(
                                    "relative h-4.5 w-8 rounded-full transition-colors duration-200",
                                    isAutoSaveOn ? "bg-primary" : "bg-input"
                                )}
                                onClick={() => setisAutoSaveOn(prev => !prev)}
                            >
                                <span
                                    className={cn(
                                        "absolute top-0.5 left-0.5 size-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out",
                                        isAutoSaveOn && "translate-x-3.5"
                                    )}
                                />
                            </button>
                            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isAutoSaveOn ? 'text-primary' : 'text-muted-foreground'}`}>
                                {isAutoSaveOn ? 'Auto-Save' : 'Auto-Save Off'}
                            </span>
                        </div>

                        {/* Mobile Share Icon Only */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="sm:hidden text-muted-foreground"
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
                            "hidden md:block border-r border-border bg-card h-full overflow-y-auto shrink-0 z-10 transition-all duration-300 ease-in-out custom-scrollbar",
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
                            <div className="relative w-[85%] max-w-[300px] bg-card h-full border-r border-border shadow-2xl animate-in slide-in-from-left duration-200">
                                <div className="flex items-center justify-between p-4 border-b border-border">
                                    <span className="font-semibold text-foreground">Blocks Library</span>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setIsMobileMenuOpen(false)}>
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
                    <main className="flex-grow h-full overflow-hidden bg-muted/40 relative">
                        {/* Scrollable Container */}
                        <div className="h-full overflow-y-auto overflow-x-hidden p-4 sm:p-8 custom-scrollbar">
                            <div className="max-w-4xl mx-auto min-h-[calc(100vh-100px)] pb-20 relative">
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
                                    <div className="mt-10 border-2 border-dashed border-border rounded-xl p-10 text-center text-muted-foreground">
                                        <LayoutTemplate className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                                        <p className="text-lg font-semibold text-foreground/80">Your canvas is empty</p>
                                        <p className="text-sm mt-1">Open the sidebar and drag a block here to start.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </DndContext>
        </div>
    );
}

export default ProposalBuilderClient;