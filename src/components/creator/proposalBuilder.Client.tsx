"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
    DndContext,
    closestCorners,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    pointerWithin
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import { Block } from '@/types/proposal';
import { ProposalBuilderBlocks } from '@/config/proposalsBluiderConfig';
import ProposalSidebar from './proposalSidebar';
import ProposalCanvas from './proposalCanvas';
import { useProposal } from '@/hooks/useProposal';
import { Loader2 } from 'lucide-react';

function ProposalBuilderClient({ proposalId }: { proposalId: string }) {
    const { isLoading, proposalData } = useProposal({ proposalId })
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [activeBlock, setActiveBlock] = useState<Block | null>(null);
    const proposalIdRef = useRef<string>(proposalId);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isAutoSaveOn, setisAutoSaveOn] = useState(false)

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

    useEffect(() => {
        //we have to fix this
        if (proposalData && !isInitialized) {
            setBlocks(proposalData.content || [])
            setIsInitialized(true)
        }
    }, [proposalData, isInitialized])

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-zinc-950 text-zinc-300">
            <Loader2 className="animate-spin mr-2" /> Loading Please Wait...
        </div>
        )
    }

    return (
        <div className="w-full bg-zinc-900">
            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="w-full flex">
                    <ProposalSidebar isCollapsed={false} setIsCollapsed={() => { }} sidebarDragableItems={ProposalBuilderBlocks} activeBlock={activeBlock} />

                    <main className="p-8 flex-grow h-full">
                        <div className='w-full flex justify-between items-center'>
                            <div className='w-full'>
                                <h1 className="text-3xl font-bold text-white mb-4">Proposal Builder</h1>
                                <p className="text-gray-400 mb-8">Drag and drop blocks to build your proposal. You can reorder them by dragging.</p>
                            </div>
                            <div className='w-full flex justify-end items-center gap-3 text-white'>
                                <p className='text-xl'>Auto Save {isAutoSaveOn ? "ON" : "OFF"}</p>
                                <div className="relative inline-block" onClick={() => setisAutoSaveOn(prev => !prev)}>
                                    <input className="peer h-6 w-12 cursor-pointer appearance-none rounded-full border border-gray-300 bg-gary-400 checked:border-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2" type="checkbox" />
                                    <span className="pointer-events-none absolute left-1 top-1 block h-4 w-4 rounded-full bg-slate-600 transition-all duration-200 peer-checked:left-7 peer-checked:bg-green-300"></span>
                                </div>
                            </div>
                        </div>

                        <SortableContext
                            items={blocks.map(b => b.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <ProposalCanvas blocks={blocks} setBlocks={setBlocks} proposalId={proposalId} isAutosaveOn={isAutoSaveOn} />
                        </SortableContext>


                    </main>
                </div>


            </DndContext>
        </div>
    );
}

export default ProposalBuilderClient;