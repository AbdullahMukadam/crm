"use client"
import React, { useState, useEffect } from 'react';
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
import { useLeads } from '@/features/Leads/hooks/useLeads';
import { LeadsDataForDashboard } from '@/types/branding';
import { LeadsDetails } from './LeadDetails';
import { toast } from 'sonner';
import brandingService from '@/lib/api/brandingService';
import { useAppSelector } from '@/lib/store/hooks';

// Types
interface Task {
    id: string;
    title: string;
    description?: string;
    leadData: LeadsDataForDashboard; // Store full lead data
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

interface ColoumDefinations {
    id: string;
    title: string;
    color: "bg-red-500" | "bg-white" | "bg-blue-500" | "bg-purple-500" | "bg-green-500";
}

// Column definitions
const COLUMN_DEFINITIONS: ColoumDefinations[] = [
    { id: 'new-lead', title: 'Leads', color: 'bg-red-500' },
    { id: 'contacted', title: 'Contacted', color: 'bg-white' },
    { id: 'qualified', title: 'Qualified', color: 'bg-blue-500' },
    { id: 'proposal-sent', title: 'Proposal Sent', color: 'bg-purple-500' },
    { id: 'won', title: 'Won', color: 'bg-green-500' },
];

// Add Task Modal Component
const AddTaskModal = ({
    isOpen,
    onClose,
    columnTitle,
    handleSubmit,
    isLoading,
    username
}: {
    isOpen: boolean;
    onClose: () => void;
    columnTitle: string;
    handleSubmit: (e: any, formData: any) => Promise<void>
    isLoading: boolean,
    username: string
}) => {
    const [name, setName] = useState("");
    const [companyName, setcompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setmobileNumber] = useState("");
    const [note, setnote] = useState("");

    const AddTask = async (e: any) => {
        const formData = {
            name,
            companyName,
            email,
            mobileNumber,
            note,
            username
        }
        await handleSubmit(e, formData)
    }

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

                <form onSubmit={AddTask} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter Name"
                            autoFocus
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-zinc-300 mb-1">
                            Company Name
                        </label>
                        <input
                            id="companyName"
                            value={companyName}
                            onChange={(e) => setcompanyName(e.target.value)}
                            className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter Company Name"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter Email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-zinc-300 mb-1">
                            Mobile Number
                        </label>
                        <input
                            id="mobileNumber"
                            value={mobileNumber}
                            onChange={(e) => setmobileNumber(e.target.value)}
                            className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter Mobile Number"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="note" className="block text-sm font-medium text-zinc-300 mb-1">
                            Note
                        </label>
                        <input
                            id="note"
                            value={note}
                            onChange={(e) => setnote(e.target.value)}
                            className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter Note"
                            required
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
                            disabled={isLoading}
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
    const { leads, loadind, error } = useLeads();
    const { username } = useAppSelector((state) => state.auth)
    const [columns, setColumns] = useState<Column[]>([]);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState<string>('');
    const [selectedLead, setselectedLead] = useState(false)
    const [selectedLeadId, setselectedLeadId] = useState("")
    const [selectedLeadData, setselectedLeadData] = useState<LeadsDataForDashboard | null>(null)
    const [isLoading, setisLoading] = useState(false)

    // Convert leads to tasks and initialize columns
    useEffect(() => {
        if (leads && leads.length > 0) {
            const initialColumns: Column[] = COLUMN_DEFINITIONS.map(colDef => ({
                id: colDef.id,
                title: colDef.title,
                tasks: []
            }));

            // Convert leads to tasks and add to "new-lead" column
            const leadTasks: Task[] = leads.map(lead => ({
                id: lead.id,
                title: lead.name,
                description: `${lead.companyName || 'No company'} - ${lead.email}\n${lead.note || ''}`,
                leadData: lead
            }));

            // Add all leads to the first column (new-lead)
            initialColumns[0].tasks = leadTasks;

            setColumns(initialColumns);
        } else if (leads && leads.length === 0) {
            // Initialize empty columns if no leads
            setColumns(COLUMN_DEFINITIONS.map(colDef => ({
                id: colDef.id,
                title: colDef.title,
                tasks: []
            })));
        }
    }, [leads]);

    useEffect(() => {
        if (!selectedLeadId) return;

        const lead = leads.filter((l) => l.id === selectedLeadId)
        setselectedLeadData(lead[0])

    }, [selectedLeadId])

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

        // TODO: Here you can add API call to update lead status in backend
        // const movedTask = findTask(activeId);
        // if (movedTask && activeData?.type === 'task') {
        //     updateLeadStatus(movedTask.task.leadData.id, newColumnId);
        // }
    };

    const handleAddTask = (columnId: string) => {
        setSelectedColumnId(columnId);
        setShowAddModal(true);
    };

    const handleSubmit = async (e: any, formData: any) => {
        if (e) e.preventDefault();
        setisLoading(true)

        try {
            const response = await brandingService.createLead(formData)
            if (response.success) {
                toast.success("Lead Created Successfully")
                const newLead: Task = {
                    id: response.data.id,
                    title: response.data.name,
                    description: `${response.data.companyName || 'No company'} - ${response.data.email}\n${response.data.note || ''}`,
                    leadData: response.data
                }

                setColumns((prev) => {
                    const newColumns = [...prev];
                    // Find the column index (should be 'new-lead' or selectedColumnId)
                    const columnIndex = newColumns.findIndex(col => col.id === selectedColumnId || col.id === 'new-lead');

                    if (columnIndex !== -1) {
                        newColumns[columnIndex] = {
                            ...newColumns[columnIndex],
                            tasks: [...newColumns[columnIndex].tasks, newLead]
                        };
                    }

                    return newColumns;
                });

                setShowAddModal(false)
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to create a Lead")
        } finally {
            setisLoading(false)
        }
    };

    const deleteLead = async (id: string) => {
        setisLoading(true)
        try {
            const response = await brandingService.deleteLead(id)
            if (response.success) {
                toast.success("Lead Deleted Succesfully")
                setColumns((prev) => {
                    const newColumns = [...prev];
                    // Find the column index (should be 'new-lead' or selectedColumnId)
                    const columnIndex = newColumns.findIndex(col => col.id === selectedColumnId || col.id === 'new-lead');

                    if (columnIndex !== -1) {
                        newColumns[columnIndex] = {
                            ...newColumns[columnIndex],
                            tasks: newColumns[columnIndex].tasks.filter((task) => task.id !== id)
                        };
                    }

                    return newColumns;
                });
                setselectedLead(false)
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to create a Lead")
        } finally {
            setisLoading(false)
        }
    }

    const selectedColumn = columns.find(col => col.id === selectedColumnId);

    if (loadind) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading leads...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-xl">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-300 mt-1">
                    Track your leads through the sales process ({leads?.length || 0} total leads)
                </p>
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
                        {columns.map((column) => {
                            const colDef = COLUMN_DEFINITIONS.find(def => def.id === column.id);
                            return (
                                <KanbanColumn
                                    key={column.id}
                                    column={column}
                                    onAddTask={handleAddTask}
                                    statusColor={colDef?.color}
                                    setselectedLeadId={setselectedLeadId}
                                    setselectedLead={setselectedLead}
                                />
                            );
                        })}
                    </SortableContext>
                </div>
            </DndContext>

            <LeadsDetails
                selectedLead={selectedLead}
                selectedLeadData={selectedLeadData}
                onOpenChnage={setselectedLead}
                deleteLead={deleteLead}
                isLoading={isLoading}
            />

            <AddTaskModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                columnTitle={selectedColumn?.title || ''}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                username={username || ""}
            />
        </div>
    );
};

export default KanbanBoard;