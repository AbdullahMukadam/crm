"use client"
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import React from 'react'

interface LeadFormItem {
    id: string;
    label: string;
    mapping: string;
    type: string;
    required: boolean;
    order: number;
}
interface LeadItemProps {
    lead: LeadFormItem,
    id: string
}
function LeadItem({ lead, id }: LeadItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        // Ensure visibility during drag
        zIndex: isDragging ? 50 : "auto", 
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="w-full">
            <div 
                onClick={(e) => console.log(e)} 
                className='w-full flex items-center justify-between border-t border-border bg-card p-2 sm:p-4 cursor-grab hover:bg-muted/40 transition-colors'
            >
                <div className='flex items-center gap-1 overflow-hidden'>
                    <GripVertical className="text-muted-foreground h-5 w-5 shrink-0" />
                    
                    <div className="flex items-center gap-2 overflow-hidden">
                        {/* Fixed Typography: Standard readable size, medium weight */}
                        <h2 className='text-[12px] lg:text-base font-medium text-foreground truncate'>
                            {lead.label}
                        </h2>
                        
                        {/* Fixed Typography: Small, subtle badge */}
                        {lead.required && (
                            <span className='text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border shrink-0'>
                                Required
                            </span>
                        )}
                    </div>
                </div>

                <div className='flex items-center justify-end pl-2 shrink-0'>
                    {/* Fixed Typography: Monospace for technical keys, smaller size, muted color */}
                    <code className='text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded'>
                        {lead.mapping}
                    </code>
                </div>
            </div>
        </div>
    )
}

export default LeadItem