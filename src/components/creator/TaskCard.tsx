import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import React, { useRef } from "react";
import { LeadsDataForDashboard } from "@/types/branding";
import { StatusPill, TONES, Tone } from "../ui/status-pill";

interface Task {
    id: string;
    title: string;
    leadData: LeadsDataForDashboard;
}

const initials = (name: string) =>
    name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();

// Pure card markup, shared by the sortable card and the drag overlay
export function TaskCardBody({ lead, tone, className = "" }: { lead: LeadsDataForDashboard; tone: Tone; className?: string }) {
    return (
        <div className={`rounded-lg border border-border bg-card p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}>
            <StatusPill tone={lead.companyName ? tone : TONES.neutral}>{lead.companyName || "Individual"}</StatusPill>

            <h3 className="mt-2.5 text-sm font-medium leading-snug text-foreground">{lead.name}</h3>
            {lead.note && (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">{lead.note}</p>
            )}

            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" />
                    {format(new Date(lead.createdAt), "dd MMM yyyy")}
                </span>
                <span
                    className="size-6 rounded-full bg-muted text-[10px] font-semibold text-foreground/70 flex items-center justify-center"
                    title={lead.name}
                >
                    {initials(lead.name)}
                </span>
            </div>

            <div className="mt-3 flex items-center gap-3 border-t border-border pt-2.5 text-xs text-muted-foreground">
                <span className="inline-flex min-w-0 items-center gap-1.5">
                    <Mail className="size-3.5 shrink-0" />
                    <span className="truncate">{lead.email}</span>
                </span>
                {lead.mobileNumber && (
                    <span className="inline-flex shrink-0 items-center gap-1.5">
                        <Phone className="size-3.5" />
                        {lead.mobileNumber}
                    </span>
                )}
            </div>
        </div>
    );
}

function TaskCard({
    task,
    columnId,
    tone,
    setselectedLead,
    setselectedLeadId,
    justDragged
}: {
    task: Task;
    columnId: string;
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
        id: task.id,
        data: {
            type: "task",
            task,
            columnId,
        },
        transition: {
            duration: 180,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
        },
    });

    // Keep the placeholder in place while the DragOverlay ghost moves
    const style = {
        transform: isDragging ? undefined : CSS.Transform.toString(transform),
        transition,
    };

    // Track pointer-down position so a drag release doesn't open the lead modal
    const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
        listeners?.onPointerDown?.(e);
    };

    const handleClick = (e: React.MouseEvent) => {
        if (justDragged) return; // ignore stray click straight after a drop
        const from = pointerDownPos.current;
        pointerDownPos.current = null;
        if (from) {
            const dx = Math.abs(e.clientX - from.x);
            const dy = Math.abs(e.clientY - from.y);
            if (dx > 5 || dy > 5) return; // this was a drag, not a click
        }
        setselectedLead(true);
        setselectedLeadId(task.id);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onPointerDown={handlePointerDown}
            onClick={handleClick}
            className={`shrink-0 rounded-lg cursor-grab active:cursor-grabbing ${isDragging ? "opacity-40" : ""}`}
        >
            <TaskCardBody
                lead={task.leadData}
                tone={tone}
                className={isDragging ? "border-dashed shadow-none" : "transition-[box-shadow,border-color] duration-150 hover:border-foreground/15 hover:shadow-sm"}
            />
        </div>
    );
}

export default TaskCard;
