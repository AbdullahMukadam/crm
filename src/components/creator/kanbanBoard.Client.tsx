"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
    DndContext,
    useSensors,
    useSensor,
    PointerSensor,
    KeyboardSensor,
    closestCorners,
    DragOverEvent,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    UniqueIdentifier,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { TaskCardBody } from './TaskCard';
import { TONES, Tone } from '../ui/status-pill';
import { PageHeader } from '../ui/page-header';
import KanbanColumn from './kanbanColoumn';
import { useLeads } from '@/features/Leads/hooks/useLeads';
import { LeadsDataForDashboard } from '@/types/branding';
import { toast } from 'sonner';
import brandingService from '@/lib/api/brandingService';
import { QUERY_KEYS } from '@/constants/query-keys';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateLeadStatusSlice } from '@/lib/store/features/leadSlice';
import { useQueryClient } from '@tanstack/react-query';

const LeadVisitsChart = dynamic(
    () => import('../layout/leads-visit').then(mod => mod.LeadVisitsChart),
    {
        ssr: false,
        loading: () => <div className="h-[300px] w-full animate-pulse bg-muted rounded-xl" />
    }
);

const LeadsDetails = dynamic(
    () => import('./LeadDetails').then(mod => mod.LeadsDetails),
    { ssr: false }
);

const AddTaskModal = dynamic(
    () => import('./AddTask'),
    { ssr: false }
);

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
    tone: Tone;
}

// Column definitions
const COLUMN_DEFINITIONS: ColoumDefinations[] = [
    { id: 'new-lead', title: 'New', tone: TONES.amber },
    { id: 'contacted', title: 'Contacted', tone: TONES.sky },
    { id: 'qualified', title: 'Qualified', tone: TONES.violet },
    { id: 'proposal-sent', title: 'Proposal Sent', tone: TONES.pink },
    { id: 'won', title: 'Won', tone: TONES.emerald },
];

// Main Kanban Board Component
const KanbanBoard = () => {
    const { leads, loadind, error } = useLeads();
    const { username } = useAppSelector((state) => state.auth)
    const [columns, setColumns] = useState<Column[]>([]);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [activeTask, setActiveTask] = useState<{ task: Task; columnId: string } | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState<string>('');
    const [selectedLead, setselectedLead] = useState(false)
    const [selectedLeadId, setselectedLeadId] = useState("")
    const [selectedLeadData, setselectedLeadData] = useState<LeadsDataForDashboard | null>(null)
    const [isLoading, setisLoading] = useState(false)
    const [pendingUrlLead, setPendingUrlLead] = useState<string | null>(null)
    const [justDragged, setJustDragged] = useState(false)
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()

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

        const lead = leads.find((l) => l.id === selectedLeadId)
        if (lead) {
            setselectedLeadData(lead)
            if (pendingUrlLead === selectedLeadId) {
                setselectedLead(true)
                setPendingUrlLead(null)
            }
        }

    }, [selectedLeadId, leads, pendingUrlLead])

    // Auto-open a lead passed via ?lead=<id> (from the header search)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const leadId = params.get('lead');
        if (leadId) {
            window.history.replaceState({}, '', window.location.pathname);
            setselectedLeadId(leadId);
            setPendingUrlLead(leadId);
        }
    }, [])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 6,
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
            const response = await dispatch(updateLeadStatusSlice({
                leadId,
                status: newStatus
            }))

            if (updateLeadStatusSlice.fulfilled.match(response)) {
                toast.success("Lead status updated Successfully")
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leads.all })
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update lead status");
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id);
        setJustDragged(true);
        const found = findTask(event.active.id);
        if (found) {
            setActiveTask({ task: found.task, columnId: found.column.id });
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
        setActiveTask(null);
        window.setTimeout(() => setJustDragged(false), 250);
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
        setActiveTask(null);
        window.setTimeout(() => setJustDragged(false), 250);

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
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leads.all })
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
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leads.all })
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
    const totalLeads = columns.reduce((sum, col) => sum + col.tasks.length, 0);
    const wonLeads = columns.find(col => col.id === 'won')?.tasks.length ?? 0;
    const toneFor = (columnId: string) =>
        (COLUMN_DEFINITIONS.find(def => def.id === columnId) ?? COLUMN_DEFINITIONS[0]).tone;

    if (loadind) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-background text-muted-foreground">
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
        <div className="grid grid-cols-1 w-full h-full gap-6">
            <PageHeader
                title="Leads Pipeline"
                description={<>{totalLeads} {totalLeads === 1 ? 'lead' : 'leads'} &middot; {wonLeads} won</>}
                actions={
                    <Button size="sm" className="gap-1.5" onClick={() => handleAddTask('new-lead')}>
                        <Plus className="size-4" />
                        Add lead
                    </Button>
                }
            />

            <div className="w-full min-w-0">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                >
                    <SortableContext items={columns.map(col => col.id)}>
                        <div className="w-full overflow-x-auto pb-4">
                            <div className="flex gap-3 w-max min-w-full">
                                {columns.map((column) => {
                                    return (
                                        <div key={column.id} className="w-[300px] shrink-0">
                                            <KanbanColumn
                                                column={column}
                                                onAddTask={handleAddTask}
                                                tone={toneFor(column.id)}
                                                setselectedLeadId={setselectedLeadId}
                                                setselectedLead={setselectedLead}
                                                justDragged={justDragged}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </SortableContext>

                    {/* Drag Overlay - Smooth drag ghost that follows the cursor */}
                    <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
                        {activeTask && (
                            <TaskCardBody
                                lead={activeTask.task.leadData}
                                tone={toneFor(activeTask.columnId)}
                                className="w-[284px] rotate-[1.5deg] shadow-xl cursor-grabbing pointer-events-none"
                            />
                        )}
                    </DragOverlay>
                </DndContext>
            </div>

            <LeadVisitsChart username={username || ""} />

            {/* Modals */}
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