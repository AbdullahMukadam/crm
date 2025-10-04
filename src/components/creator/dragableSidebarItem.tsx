import { Block } from '@/types/proposal'
import { useDraggable } from '@dnd-kit/core';
import React from 'react'
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface DragableSidebarItemProps {
    item: Block,
    key: string
}
function DragableSidebarItem({ item, key }: DragableSidebarItemProps) {
    const { id, type, props } = item;
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
            variant="outline"
            className={`bg-transparent w-full justify-start cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'} ${cn(props?.className)}`}
            {...listeners}
            {...attributes}
        >
            {type}
        </Button>
    )
}

export default DragableSidebarItem