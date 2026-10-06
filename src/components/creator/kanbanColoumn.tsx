import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import TaskCard from './TaskCard';
import { Tone } from '../ui/status-pill';
import { Plus, MoreHorizontal } from 'lucide-react';
import { LeadsDataForDashboard } from '@/types/branding';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Task {
    id: string;
    title: string;
    leadData: LeadsDataForDashboard;
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

const iconButton = "size-6 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground transition-colors";

function KanbanColumn({
    column,
    onAddTask,
    tone,
    setselectedLead,
    setselectedLeadId,
    justDragged
}: {
    column: Column;
    onAddTask: (columnId: string) => void;
    tone: Tone;
    setselectedLead: React.Dispatch<React.SetStateAction<boolean>>;
    setselectedLeadId: React.Dispatch<React.SetStateAction<string>>;
    justDragged: boolean;
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
        transition: {
            duration: 180,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
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
            className={`flex max-h-[calc(100vh-220px)] min-h-[200px] flex-col rounded-xl bg-muted/60 p-2 ${isDragging ? 'opacity-50' : ''}`}
        >
            {/* Column Header */}
            <div
                {...attributes}
                {...listeners}
                className="mb-1 flex items-center justify-between px-1.5 py-1.5 cursor-grab active:cursor-grabbing"
            >
                <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${tone.dot}`} />
                    <span className="text-sm font-medium text-foreground">{column.title}</span>
                    <span className={`min-w-5 h-5 px-1.5 rounded-full text-[11px] font-semibold text-white flex items-center justify-center ${tone.dot}`}>
                        {column.tasks.length}
                    </span>
                </div>
                <div className="flex items-center gap-0.5">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddTask(column.id);
                        }}
                        className={iconButton}
                        aria-label={`Add lead to ${column.title}`}
                    >
                        <Plus className="size-4" />
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={iconButton} aria-label={`${column.title} options`}>
                                <MoreHorizontal className="size-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-40">
                            <DropdownMenuItem className="cursor-pointer" onSelect={() => onAddTask(column.id)}>
                                <Plus className="size-4" />
                                Add lead
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Tasks */}
            <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
                    {column.tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            columnId={column.id}
                            tone={tone}
                            setselectedLeadId={setselectedLeadId}
                            setselectedLead={setselectedLead}
                            justDragged={justDragged}
                        />
                    ))}

                    {column.tasks.length === 0 && (
                        <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                            No leads here yet
                        </div>
                    )}
                </div>
            </SortableContext>

            <button
                onClick={() => onAddTask(column.id)}
                className="mt-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
            >
                <Plus className="size-3.5" />
                Add lead
            </button>
        </div>
    );
}

export default KanbanColumn;
