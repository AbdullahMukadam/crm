
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal } from 'lucide-react';
import React from 'react'

interface Task {
    id: string;
    title: string;
    description?: string;
}

function TaskCard({ task, columnId }: { task: Task; columnId: string }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'task',
            task,
            columnId,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
                bg-zinc-700 p-3 rounded-lg shadow-sm 
                cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow
                ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
            `}
        >
            <h4 className="font-medium text-gray-300 mb-1">{task.title}</h4>
            {task.description && (
                <p className="text-sm text-gray-400">{task.description}</p>
            )}
            <div className="mt-2 flex justify-end">
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded">
                    <MoreHorizontal size={14} />
                </button>
            </div>
        </div>
    );
};


export default TaskCard