import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import TaskCard from './TaskCard';
import { Plus, MoreHorizontal } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    description?: string;
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
    icon?: React.ComponentType<{ className?: string }>;
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

    const StatusIcon = column.icon;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`shrink-0 min-w-[300px] flex flex-col h-full ${isDragging ? 'opacity-50' : ''}`}
        >
            <div className="rounded-lg border border-border p-3 bg-muted/70 dark:bg-muted/50 flex flex-col max-h-full">
                {/* Column Header */}
                <div
                    {...attributes}
                    {...listeners}
                    className="flex items-center justify-between mb-2 rounded-lg cursor-grab active:cursor-grabbing"
                >
                    <div className="flex items-center gap-2">
                        {StatusIcon ? (
                            <div className="size-4 flex items-center justify-center">
                                <StatusIcon className="size-4" />
                            </div>
                        ) : (
                            <span className={`h-2.5 w-2.5 ${statusColor} rounded-full`}></span>
                        )}
                        <span className="text-sm font-medium">{column.title}</span>
                        <span className="text-sm text-muted-foreground">
                            {column.tasks.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddTask(column.id);
                            }}
                            className="h-6 w-6 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            <Plus className="size-4" />
                        </button>
                        <button className="h-6 w-6 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                            <MoreHorizontal className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Tasks */}
                <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-3 overflow-y-auto h-full">
                        {column.tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                columnId={column.id}
                                setselectedLeadId={setselectedLeadId}
                                setselectedLead={setselectedLead}
                            />
                        ))}

                        <button
                            onClick={() => onAddTask(column.id)}
                            className="gap-2 text-xs h-auto py-1 px-0 self-start hover:bg-background rounded-md inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Plus className="size-4" />
                            <span>Add task</span>
                        </button>
                    </div>
                </SortableContext>
            </div>
        </div>
    );
}

export default KanbanColumn;