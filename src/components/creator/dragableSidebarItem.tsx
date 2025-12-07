import { Block } from '@/types/proposal'
import { useDraggable } from '@dnd-kit/core';
import React from 'react'
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Image, Pen, Video } from 'lucide-react';

interface DragableSidebarItemProps {
    item: Block,
}

function DragableSidebarItem({ item }: DragableSidebarItemProps) {
    const { id, type, props, size, position } = item;
    const { isDragging, attributes, listeners, setNodeRef } = useDraggable({
        id: id,
        data: {
            type: 'sidebar-item',
            item,
        },
    })

    return (
        <Button
            ref={setNodeRef}
            // Changed variant to "outline" or "secondary" usually fits better, 
            // but here we use custom classes for the strict B&W look.
            variant={"outline"} 
            className={cn(
                // Base Layout & Sizing
                "w-full h-auto py-4 px-4 justify-start flex items-center gap-6 overflow-hidden pl-7",
                
                // Typography (Clean & Minimal)
                "text-xs font-semibold uppercase tracking-widest text-neutral-900",
                
                // Colors & Borders (Black & White Theme)
                "bg-white border border-neutral-200 shadow-sm",
                
                // Cursor interaction
                "cursor-grab active:cursor-grabbing",
                
                // Dragging State (Visual feedback)
                isDragging && "opacity-50 border-neutral-400 border-dashed bg-neutral-50",
                
                // Custom prop overrides
                props?.className
            )}
            {...listeners}
            {...attributes}
        >
           {type === "text" && (<Pen />)}
           {type === "image" && (<Image />)}
           {type === "video" && (<Video />)}
            
            {type}
        </Button>
    )
}

export default DragableSidebarItem