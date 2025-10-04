"use client";

import React, { useState } from 'react';
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
    DragOverlay
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid'; // For generating unique IDs

import { Block } from '@/types/proposal';
import { ProposalBuilderBlocks } from '@/config/proposalsBluiderConfig'; // Assuming this is your sidebar config
import ProposalSidebar from './proposalSidebar';
import ProposalCanvas from './proposalCanvas';
import { BlockRenderer } from './blockRenderer'; // For the DragOverlay

function ProposalBuilderClient() {
    // Blocks that are actually on the canvas
    const [blocks, setBlocks] = useState<Block[]>([]);
    // The block being dragged (for visual overlay)
    const [activeBlock, setActiveBlock] = useState<Block | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10, // A higher distance prevents accidental drags
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        // Check if it's a new item from the sidebar or an existing block
        if (active.data.current?.type === 'sidebar-item') {
            setActiveBlock(active.data.current.item);
        } else {
            const activeBlock = blocks.find(block => block.id === active.id);
            setActiveBlock(activeBlock || null);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const isSidebarItem = active.data.current?.type === 'sidebar-item';
        // The droppable area is identified by its ID, not data.type
        const isOverCanvas = over.id === 'canvas';

        // --- Logic for dropping a NEW item onto the canvas ---
        if (isSidebarItem && isOverCanvas && active.data.current) {
            const newBlockTemplate = active.data.current.item as Block;

            // Check if this specific drag action has already added the block
            const blockIsAlreadyOnCanvas = blocks.some(b => b.id === active.id);
            if (blockIsAlreadyOnCanvas) return;

            setBlocks((prevBlocks) => [
                ...prevBlocks,
                {
                    ...newBlockTemplate,
                    id: nanoid(), // **CRITICAL FIX**: Generate a new unique ID
                },
            ]);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveBlock(null); // Clear the active block for the overlay
        const { active, over } = event;
        if (!over) return;

        const isSidebarItem = active.data.current?.type === 'sidebar-item';
        
        // If dragging from sidebar, the logic is handled in onDragOver, so we do nothing here.
        if (isSidebarItem) return;

        // --- **FIX**: Logic for REORDERING existing blocks ---
        const activeId = active.id;
        const overId = over.id;

        if (activeId !== overId) {
            setBlocks((items) => {
                const oldIndex = items.findIndex((item) => item.id === activeId);
                const newIndex = items.findIndex((item) => item.id === overId);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <div className='w-full h-full bg-zinc-900'>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className='w-full flex h-full'>
                    {/* The sidebar now gets its items from a static config, not the canvas state */}
                    <ProposalSidebar isCollapsed={false} setIsCollapsed={() => { }} sidebarDragableItems={ProposalBuilderBlocks} />

                    <main className='p-8 flex-grow h-full'>
                        <h1 className='text-3xl font-bold text-white mb-8'>Proposal Builder</h1>
                        <SortableContext items={blocks.map(b => b.id)}>
                            <ProposalCanvas blocks={blocks} setBlocks={setBlocks} />
                        </SortableContext>
                    </main>
                </div>
                
                {/* DragOverlay provides a clean visual feedback during drag */}
                <DragOverlay>
                    {activeBlock ? (
                        <BlockRenderer 
                           block={activeBlock} 
                           deleteBlock={() => {}} 
                           updateBlockProps={() => {}} 
                        />
                    ) : null}
                </DragOverlay>

            </DndContext>
        </div>
    );
}

export default ProposalBuilderClient;
