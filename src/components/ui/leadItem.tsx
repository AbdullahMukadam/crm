
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
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div onClick={(e) => console.log(e)} key={lead.label} className='w-full flex border-t cursor-grab border-gray-500 p-2'>
                <div className='w-1/2 flex items-center gap-2'>
                   <GripVertical color='gray' />
                    <h2 className='text-xl'>{lead.label}</h2>
                    {lead.required && <span className='bg-gray-500 text-white rounded-xl px-2'>Required</span>}
                </div>
                <div className='w-1/2 flex justify-end'>
                    <h2 className='text-xl'>{lead.mapping}</h2>
                </div>
            </div>
        </div>
    )
}

export default LeadItem