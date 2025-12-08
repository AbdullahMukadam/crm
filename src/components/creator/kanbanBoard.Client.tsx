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
import { Loader2, X } from 'lucide-react';
import KanbanColumn from './kanbanColoumn';
import { useLeads } from '@/features/Leads/hooks/useLeads';
import { LeadsDataForDashboard } from '@/types/branding';
import { LeadsDetails } from './LeadDetails';
import { toast } from 'sonner';
import brandingService from '@/lib/api/brandingService';
import { useAppSelector } from '@/lib/store/hooks';
import { ChartAreaInteractive } from '../ui/chart-area-interactive';
import { LeadVisitsChart } from '../ui/leads-visit';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Types
interface Task {
    id: string;
    title: string;
    description?: string;
    leadData: LeadsDataForDashboard;
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

    // Reset form when modal opens/closes
    useEffect(() => {
        if(!isOpen) {
             setName("");
             setcompanyName("");
             setEmail("");
             setmobileNumber("");
             setnote("");
        }
    }, [isOpen]);

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

    // Handle Open Change for Shadcn
    const handleOpenChange = (open: boolean) => {
        if (!open) onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-zinc-900 border-zinc-700 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Task to {columnTitle}</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={AddTask} className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-zinc-300">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Enter Name"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="companyName" className="text-zinc-300">Company Name</Label>
                        <Input
                            id="companyName"
                            value={companyName}
                            onChange={(e) => setcompanyName(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Enter Company Name"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-zinc-300">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Enter Email"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="mobileNumber" className="text-zinc-300">Mobile Number</Label>
                        <Input
                            id="mobileNumber"
                            value={mobileNumber}
                            onChange={(e) => setmobileNumber(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Enter Mobile Number"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="note" className="text-zinc-300">Note</Label>
                        <Input
                            id="note"
                            value={note}
                            onChange={(e) => setnote(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Enter Note"
                            required
                        />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
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

    useEffect(() => {
        if (leads && leads.length > 0) {
            const initialColumns: Column[] = COLUMN_DEFINITIONS.map(colDef => ({
                id: colDef.id,
                title: colDef.title,
                tasks: []
            }));

            // Convert leads to tasks and organize by their status
            leads.forEach(lead => {
                const task: Task = {
                    id: lead.id,
                    title: lead.name,
                    description: `${lead.companyName || 'No company'} - ${lead.email}`,
                    leadData: lead
                };

                const columnIndex = initialColumns.findIndex(col => col.id === (lead.status || 'new-lead'));

                if (columnIndex !== -1) {
                    initialColumns[columnIndex].tasks.push(task);
                } else {
                    initialColumns[0].tasks.push(task);
                }
            });

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

    // Update lead status in backend
    const updateLeadStatus = async (leadId: string, newStatus: string) => {
        try {
            await brandingService.updateLeadStatus(leadId, newStatus);
            toast.success("Lead status updated");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update lead status");
        }
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
        const activeData = active.data.current;

        const movedTask = findTask(activeId);
        if (movedTask && activeData?.type === 'task') {
            updateLeadStatus(movedTask.task.leadData.id, movedTask.column.id);
        }

        if (activeId === overId) return;


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

    const handleSubmit = async (e: any, formData: any) => {
        if (e) e.preventDefault();
        setisLoading(true)

        try {
            // Add status to formData
            const leadData = {
                ...formData,
                status: selectedColumnId || 'new-lead'
            };

            const response = await brandingService.createLead(leadData)
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
                    const columnIndex = newColumns.findIndex(col => col.id === selectedColumnId);

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
                toast.success("Lead Deleted Successfully")
                setColumns((prev) => {
                    return prev.map(column => ({
                        ...column,
                        tasks: column.tasks.filter((task) => task.id !== id)
                    }));
                });
                setselectedLead(false)
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to delete Lead")
        } finally {
            setisLoading(false)
        }
    }

    const selectedColumn = columns.find(col => col.id === selectedColumnId);

    if (loadind) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-zinc-950 text-zinc-300">
                <Loader2 className="animate-spin mr-2" /> Loading Leads...
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
        <div className="w-full min-h-screen flex flex-col">
            {/* <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-300 mt-1">
                    Track your leads through the sales process ({leads?.length || 0} total leads)
                </p>
            </div> */}

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

            <LeadVisitsChart username={username || ""} />

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