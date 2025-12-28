'use client';

import { Block } from '@/types/proposal';
import { useDraggable } from '@dnd-kit/core';
import React from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { 
  Image as ImageIcon, 
  Type, 
  Video, 
  Box, 
  Heading, 
  Columns2,
  LayoutTemplate
} from 'lucide-react';

interface DragableSidebarItemProps {
    item: Block;
    isCollapsed?: boolean;
}

// Helper to map block types to icons
const getBlockIcon = (type: string) => {
    switch (type.toLowerCase()) {
        case 'text': return <Type size={18} />;
        case 'heading': return <Heading size={18} />;
        case 'image': return <ImageIcon size={18} />;
        case 'video': return <Video size={18} />;
        case 'columns': return <Columns2 size={18} />;
        case 'hero': return <LayoutTemplate size={18} />;
        default: return <Box size={18} />;
    }
};

function DragableSidebarItem({ item, isCollapsed = false }: DragableSidebarItemProps) {
    const { id, type } = item;
    
    const { isDragging, attributes, listeners, setNodeRef } = useDraggable({
        id: id,
        data: {
            type: 'sidebar-item',
            item,
        },
    });

    return (
        <Button
            ref={setNodeRef}
            // "ghost" is standard for sidebar items; "secondary" if you want them filled
            variant="ghost" 
            className={cn(
                // Base Layout
                "h-10 w-full flex items-center transition-all duration-200 ease-in-out",
                
                // Collapsed vs Expanded Layout
                isCollapsed 
                    ? "justify-center px-0 w-10 mx-auto" // Square shape when collapsed
                    : "justify-start px-3 gap-3",        // Full width when expanded

                // Colors (Dark mode friendly based on your sidebar)
                "text-zinc-400 hover:text-white hover:bg-zinc-800",

                // Dragging State
                isDragging && "opacity-50 ring-2 ring-zinc-700 bg-zinc-800/50 cursor-grabbing",

                // Cursor interaction
                "cursor-grab active:cursor-grabbing"
            )}
            {...listeners}
            {...attributes}
            title={type} // Tooltip fallback for collapsed state
        >
            {/* Icon Wrapper */}
            <span className={cn(
                "flex items-center justify-center transition-colors",
                isDragging ? "text-white" : "text-current"
            )}>
                {getBlockIcon(type)}
            </span>
            
            {/* Label - Hidden when collapsed */}
            {!isCollapsed && (
                <span className="text-sm font-medium capitalize truncate">
                    {type}
                </span>
            )}
        </Button>
    );
}

export default DragableSidebarItem;