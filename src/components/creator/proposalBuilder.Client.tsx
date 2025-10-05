"use client";

import React, { useRef, useState } from 'react';
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

function ProposalBuilderClient() {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [activeBlock, setActiveBlock] = useState<Block | null>(null);

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

    return (
        <div className="w-full bg-zinc-900">
            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="w-full flex">
                    <ProposalSidebar isCollapsed={false} setIsCollapsed={() => { }} sidebarDragableItems={ProposalBuilderBlocks} />

                    <main className="p-8 flex-grow h-full">
                        <h1 className="text-3xl font-bold text-white mb-4">Proposal Builder</h1>
                        <p className="text-gray-400 mb-8">Drag and drop blocks to build your proposal. You can reorder them by dragging.</p>
                        <SortableContext
                            items={blocks.map(b => b.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <ProposalCanvas blocks={blocks} setBlocks={setBlocks} />
                        </SortableContext>

                        
                    </main>
                </div>

                <DragOverlay>
                    {activeBlock ? (
                        <div className="bg-zinc-950 text-white p-4 rounded-md shadow-2xl border-2 border-white opacity-90">
                            <div className="font-semibold">{activeBlock.type} Block</div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

export default ProposalBuilderClient;