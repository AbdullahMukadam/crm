import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  MessageSquare,
  FileText,
  Link,
  CheckCircle,
  InfoIcon,
  Hexagon,
  Stars,
} from "lucide-react";
import React, { useRef } from "react";

interface User {
    id: string;
    name: string;
    avatar?: string;
}

interface Label {
    id: string;
    name: string;
    color?: string;
}

interface Progress {
    completed: number;
    total: number;
}

interface Status {
    icon: React.ComponentType<{ className?: string }>;
}

interface Task {
    id: string;
    title: string;
    description?: string;
    status?: Status;
    priority?: 'urgent' | 'high' | 'medium' | 'low';
    labels?: Label[];
    date?: string;
    comments?: number;
    attachments?: number;
    links?: number;
    progress?: Progress;
    assignees?: User[];
}

function TaskCard({ 
    task, 
    columnId, 
    setselectedLead, 
    setselectedLeadId,
    justDragged
}: {
    task: Task;
    columnId: string;
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

    const StatusIcon = task.status?.icon;
    const hasProgress = task.progress && task.progress.total > 0;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onPointerDown={handlePointerDown}
            onClick={handleClick}
            className={`bg-background shrink-0 rounded-lg overflow-hidden border border-border cursor-grab active:cursor-grabbing
                ${isDragging ? "opacity-30 ring-1 ring-primary/20" : "hover:shadow-md hover:border-border/70 transition-[box-shadow,border-color] duration-200"}
            `}
        >
            <div className="px-3 py-2.5">
                <div className="flex items-center gap-2 mb-2">
                    {StatusIcon && (
                        <div className="size-5 mt-0.5 shrink-0 flex items-center justify-center bg-muted rounded-sm p-1">
                            <StatusIcon className="size-4" />
                        </div>
                    )}
                    <h3 className="text-sm font-medium leading-tight flex-1">
                        {task.title}
                    </h3>
                   
                </div>

                {task.description && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {task.description}
                    </p>
                )}

                {task.labels && task.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {task.labels.map((label) => (
                            <span
                                key={label.id}
                                className={`text-[10px] px-1.5 py-0.5 font-medium rounded-md bg-secondary text-secondary-foreground ${label.color || ''}`}
                            >
                                {label.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="px-3 py-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        {task.date && (
                            <div className="flex items-center gap-1.5 border border-border rounded-sm py-1 px-2">
                                <Calendar className="size-3" />
                                <span>{task.date}</span>
                            </div>
                        )}
                        {task.comments && task.comments > 0 && (
                            <div className="flex items-center gap-1.5 border border-border rounded-sm py-1 px-2">
                                <MessageSquare className="size-3" />
                                <span>{task.comments}</span>
                            </div>
                        )}
                        {task.attachments && task.attachments > 0 && (
                            <div className="flex items-center gap-1.5 border border-border rounded-sm py-1 px-2">
                                <FileText className="size-3" />
                                <span>{task.attachments}</span>
                            </div>
                        )}
                        {task.links && task.links > 0 && (
                            <div className="flex items-center gap-1.5 border border-border rounded-sm py-1 px-2">
                                <Link className="size-3" />
                                <span>{task.links}</span>
                            </div>
                        )}
                       
                    </div>

                    {task.assignees && task.assignees.length > 0 && (
                        <div className="flex -space-x-2">
                            {task.assignees.map((user) => (
                                <div
                                    key={user.id}
                                    className="size-5 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden"
                                >
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="size-full object-cover" />
                                    ) : (
                                        <span className="text-[10px] font-medium">
                                            {user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TaskCard;