'use client';

import { Block } from '@/types/proposal';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';
import { getBlockIcon } from './blockIcons';

interface DragableSidebarItemProps {
    item: Block;
    isCollapsed?: boolean;
}

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
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            title={type}
            className={cn(
                // Base Layout
                "group relative flex items-center gap-3 rounded-lg px-3 h-11 transition-colors duration-150",
                "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent hover:border-border",
                "cursor-grab active:cursor-grabbing select-none touch-none",

                // Collapsed vs Expanded Layout
                isCollapsed ? "justify-center px-2" : "w-full",

                // Dragging State
                isDragging && "opacity-50 ring-1 ring-primary/30 bg-muted/60"
            )}
        >
            {/* Icon Chip */}
            <span className={cn(
                "shrink-0 size-8 rounded-md flex items-center justify-center transition-colors",
                "bg-muted/70 border border-border text-muted-foreground",
                "group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/30",
                isDragging && "text-primary"
            )}>
                {getBlockIcon(type)}
            </span>

            {/* Label - Hidden when collapsed */}
            {!isCollapsed && (
                <>
                    <span className="flex-1 text-sm font-medium capitalize truncate">
                        {type}
                    </span>
                    <GripVertical className="size-4 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors" />
                </>
            )}
        </div>
    );
}

export default DragableSidebarItem;