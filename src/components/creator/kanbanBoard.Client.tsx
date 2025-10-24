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
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { X } from 'lucide-react';
import KanbanColumn from './kanbanColoumn';

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





// Add Task Modal Component
const AddTaskModal = ({
    isOpen,
    onClose,
    onAdd,
    columnTitle,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (title: string, description: string) => void;
    columnTitle: string;
  }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
  
    const handleSubmit = (e?: any) => {
      if (e) e.preventDefault();
      if (title.trim()) {
        onAdd(title.trim(), description.trim());
        setTitle("");
        setDescription("");
        onClose();
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-zinc-900 border border-zinc-700 text-white rounded-2xl p-6 w-96 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add Task to {columnTitle}</h3>
            <button onClick={onClose} className="text-zinc-400 hover:text-white transition">
              <X size={20} />
            </button>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">
                Task Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter task title"
                autoFocus
              />
            </div>
  
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter task description (optional)"
              />
            </div>
  
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
              >
                Add Task
              </button>
            </div>
          </form>
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
        <div className="w-full min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-300 mt-1">Track your leads through the sales process</p>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="w-full flex flex-wrap md:flex-nowrap gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    <SortableContext items={columns.map(col => col.id)}>
                        {columns.map((column) => (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                onAddTask={handleAddTask}
                                statusColor={
                                    column.id === 'new-lead' ? 'bg-red-500' :
                                        column.id === 'contacted' ? 'bg-white' :
                                            column.id === 'qualified' ? 'bg-blue-500' :
                                                column.id === 'proposal-sent' ? 'bg-purple-500' :
                                                    column.id === 'won' ? 'bg-green-500' : undefined
                                }
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