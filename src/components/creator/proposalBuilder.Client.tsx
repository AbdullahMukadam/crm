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
    pointerWithin
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import { Block } from '@/types/proposal';
import { ProposalBuilderBlocks } from '@/config/proposalsBluiderConfig';
import { useProposal } from '@/hooks/useProposal';
import { Link, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const ProposalSidebar = dynamic(() => import('./proposalSidebar'), {
    ssr: false,
    loading: () => <div className="w-[300px] h-full bg-zinc-900 border-r border-zinc-800" />
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
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [activeBlock, setActiveBlock] = useState<Block | null>(null);
    const proposalIdRef = useRef<string>(proposalId);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isAutoSaveOn, setisAutoSaveOn] = useState(false)
    const [isCollapsed, setisCollapsed] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
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
        toast.success("Link Coppied Successfully")
    }, [])

    useEffect(() => {
        if (proposalData && !isInitialized) {
            setBlocks(proposalData.content || [])
            setIsInitialized(true)
        }
    }, [proposalData, isInitialized])

    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100">
                <Loader2 className="animate-spin mb-4 h-8 w-8 text-zinc-400" />
                <p className="uppercase tracking-widest text-sm font-semibold text-zinc-500">Loading Proposal...</p>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800">
            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="w-full flex h-screen overflow-hidden">
                    <div className="border-r border-zinc-800 bg-zinc-900 h-full overflow-y-auto">
                        <ProposalSidebar
                            isCollapsed={isCollapsed}
                            setIsCollapsed={setisCollapsed}
                            sidebarDragableItems={ProposalBuilderBlocks}
                            activeBlock={activeBlock}
                        />
                    </div>

                    <main className="flex-grow h-full flex flex-col overflow-hidden">

                        {/* Page Header - Dark Theme */}
                        <div className='w-full px-8 py-6 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center z-10 shadow-sm shadow-zinc-950/50'>
                            <div>
                                <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
                                    Proposal Builder
                                </h1>
                                <p className="text-zinc-500 text-xs mt-1 font-medium tracking-wide">
                                    Drag blocks to canvas &bull; Reorder freely
                                </p>
                            </div>

                            {/* Dark Mode Toggle Switch */}
                            <div className='flex items-center gap-4'>
                                <Button variant={"link"} onClick={() => handleCreateSharableLink(proposalId)}>
                                    <Link />
                                    Share
                                </Button>
                                <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${isAutoSaveOn ? 'text-white' : 'text-zinc-500'}`}>
                                    Auto Save
                                </span>

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
                                    <div className="w-11 h-6 bg-zinc-700 rounded-full peer-checked:bg-white peer-focus:ring-2 peer-focus:ring-zinc-600 transition-colors duration-200 ease-in-out"></div>

                                    <div className="absolute left-1 top-1 bg-zinc-300 peer-checked:bg-black w-4 h-4 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow overflow-auto p-8 bg-zinc-950">
                            <div className="max-w-5xl mx-auto">
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
                            </div>
                        </div>
                    </main>
                </div>
            </DndContext>
        </div>
    );
}

export default ProposalBuilderClient;