"use client"
import React, { useState } from 'react';
import {
    DndContext,
    useSensors,
    useSensor,
    PointerSensor,
    KeyboardSensor,
    closestCorners,
    DragOverEvent,
    DragEndEvent,
    DragStartEvent,
    UniqueIdentifier,
    useDndMonitor,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, MoreHorizontal, X } from 'lucide-react';

// Types
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

// Sample data
const initialData: Column[] = [
    {
        id: 'new-lead',
        title: 'New Lead',
        tasks: [
            { id: 'task-1', title: 'Contact via email', description: 'Reach out to potential client' },
            { id: 'task-2', title: 'Schedule meeting', description: 'Set up initial consultation' },
        ],
    },
    {
        id: 'contacted',
        title: 'Contacted',
        tasks: [
            { id: 'task-3', title: 'Follow up call', description: 'Schedule follow-up discussion' },
        ],
    },
    {
        id: 'qualified',
        title: 'Qualified',
        tasks: [
            { id: 'task-4', title: 'Send proposal', description: 'Prepare and send project proposal' },
        ],
    },
    {
        id: 'proposal-sent',
        title: 'Proposal Sent',
        tasks: [
            { id: 'task-5', title: 'Negotiate terms', description: 'Discuss project terms and pricing' },
        ],
    },
    {
        id: 'won',
        title: 'Won',
        tasks: [
            { id: 'task-6', title: 'Onboard client', description: 'Begin project onboarding process' },
        ],
    }
];

// Task Card Component
const TaskCard = ({ task, columnId }: { task: Task; columnId: string }) => {
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
                bg-white p-3 rounded-lg shadow-sm border border-gray-200 
                cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow
                ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
            `}
        >
            <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
            {task.description && (
                <p className="text-sm text-gray-600">{task.description}</p>
            )}
            <div className="mt-2 flex justify-end">
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded">
                    <MoreHorizontal size={14} />
                </button>
            </div>
        </div>
    );
};

// Column Component
const KanbanColumn = ({
    column,
    onAddTask
}: {
    column: Column;
    onAddTask: (columnId: string) => void;
}) => {
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
                bg-gray-50 rounded-lg p-4 min-w-fit min-h-96
                ${isDragging ? 'opacity-50' : ''}
            `}
        >
            {/* Column Header */}
            <div
                {...attributes}
                {...listeners}
                className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing"
            >
                <h3 className="font-semibold text-gray-800 flex items-center">
                    {column.title}
                    <span className="ml-2 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {column.tasks.length}
                    </span>
                </h3>
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
                        />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
};

// Add Task Modal Component
const AddTaskModal = ({
    isOpen,
    onClose,
    onAdd,
    columnTitle
}: {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (title: string, description: string) => void;
    columnTitle: string;
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e?: any) => {
        if (e) e.preventDefault();
        if (title.trim()) {
            onAdd(title.trim(), description.trim());
            setTitle('');
            setDescription('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add Task to {columnTitle}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Task Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter task title"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter task description (optional)"
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!title.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Kanban Board Component
const KanbanBoard = () => {
    const [columns, setColumns] = useState<Column[]>(initialData);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState<string>('');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findColumn = (id: UniqueIdentifier) => {
        return columns.find(column => column.id === id);
    };

    const findTask = (id: UniqueIdentifier) => {
        for (const column of columns) {
            const task = column.tasks.find(task => task.id === id);
            if (task) {
                return { task, column };
            }
        }
        return null;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        // Handle task over task or column
        if (activeData?.type === 'task') {
            const activeTask = findTask(activeId);
            if (!activeTask) return;

            const { column: activeColumn } = activeTask;
            let overColumn: Column;

            if (overData?.type === 'task') {
                const overTask = findTask(overId);
                if (!overTask) return;
                overColumn = overTask.column;
            } else if (overData?.type === 'column') {
                overColumn = findColumn(overId)!;
            } else {
                return;
            }

            if (activeColumn.id !== overColumn.id) {
                setColumns(prev => {
                    const newColumns = [...prev];
                    const activeColumnIndex = newColumns.findIndex(col => col.id === activeColumn.id);
                    const overColumnIndex = newColumns.findIndex(col => col.id === overColumn.id);

                    // Remove task from active column
                    const taskToMove = newColumns[activeColumnIndex].tasks.find(task => task.id === activeId);
                    newColumns[activeColumnIndex] = {
                        ...newColumns[activeColumnIndex],
                        tasks: newColumns[activeColumnIndex].tasks.filter(task => task.id !== activeId)
                    };

                    // Add task to over column
                    if (taskToMove) {
                        newColumns[overColumnIndex] = {
                            ...newColumns[overColumnIndex],
                            tasks: [...newColumns[overColumnIndex].tasks, taskToMove]
                        };
                    }

                    return newColumns;
                });
            }
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const activeData = active.data.current;

        // Handle task reordering within the same column
        if (activeData?.type === 'task') {
            const activeTask = findTask(activeId);
            const overTask = findTask(overId);

            if (activeTask && overTask && activeTask.column.id === overTask.column.id) {
                setColumns(prev => {
                    const newColumns = [...prev];
                    const columnIndex = newColumns.findIndex(col => col.id === activeTask.column.id);
                    const column = newColumns[columnIndex];

                    const activeIndex = column.tasks.findIndex(task => task.id === activeId);
                    const overIndex = column.tasks.findIndex(task => task.id === overId);

                    newColumns[columnIndex] = {
                        ...column,
                        tasks: arrayMove(column.tasks, activeIndex, overIndex)
                    };

                    return newColumns;
                });
            }
        }

        // Handle column reordering
        if (activeData?.type === 'column') {
            const activeColumnIndex = columns.findIndex(col => col.id === activeId);
            const overColumnIndex = columns.findIndex(col => col.id === overId);

            setColumns(prev => arrayMove(prev, activeColumnIndex, overColumnIndex));
        }
    };

    const handleAddTask = (columnId: string) => {
        setSelectedColumnId(columnId);
        setShowAddModal(true);
    };

    const handleTaskCreate = (title: string, description: string) => {
        const newTask: Task = {
            id: `task-${Date.now()}`,
            title,
            description,
        };

        setColumns(prev => prev.map(column =>
            column.id === selectedColumnId
                ? { ...column, tasks: [...column.tasks, newTask] }
                : column
        ));
    };

    const selectedColumn = columns.find(col => col.id === selectedColumnId);

    return (
        <div className="w-full h-screen bg-gray-100 p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
                <p className="text-gray-600 mt-1">Track your leads through the sales process</p>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="w-full flex gap-6 overflow-x-auto pb-6">
                    <SortableContext items={columns.map(col => col.id)}>
                        {columns.map((column) => (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                onAddTask={handleAddTask}
                            />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            <AddTaskModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleTaskCreate}
                columnTitle={selectedColumn?.title || ''}
            />
        </div>
    );
};

export default KanbanBoard;