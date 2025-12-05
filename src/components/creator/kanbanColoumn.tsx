import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react'
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    description?: string;
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

function KanbanColumn({
    column,
    onAddTask,
    statusColor,
    setselectedLead,
    setselectedLeadId

}: {
    column: Column;
    onAddTask: (columnId: string) => void;
    statusColor?: 'bg-red-500' | 'bg-white' | 'bg-green-500' | 'bg-blue-500' | 'bg-purple-500';
    setselectedLead: React.Dispatch<React.SetStateAction<boolean>>;
    setselectedLeadId: React.Dispatch<React.SetStateAction<string>>
}) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: 'column',
            column,
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
            className={`
                bg-zinc-900 border border-zinc-800 rounded-2xl  shadow-sm hover:shadow-md transition-all duration-200  p-4 w-full md:min-w-fit min-h-96
                ${isDragging ? 'opacity-50' : ''}
            `}
        >
            {/* Column Header */}
            <div
                {...attributes}
                {...listeners}
                className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing"
            >
                <div className='flex gap-2 items-center'>
                    <span className={`h-2.5 w-2.5 ${statusColor} rounded-full`}></span>
                    <h3 className="font-semibold text-gray-200 flex items-center">
                        {column.title}
                        <span className="ml-2 text-gray-400 ">
                            {column.tasks.length}
                        </span>
                    </h3>
                </div>
                <button
                    onClick={() => onAddTask(column.id)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200"
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* Tasks */}
            <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3 min-h-24">
                    {column.tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            columnId={column.id}
                            setselectedLeadId={setselectedLeadId}
                            setselectedLead={setselectedLead}
                        />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
};

export default KanbanColumn