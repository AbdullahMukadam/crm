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
import React from "react";

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
    setselectedLeadId 
}: {
    task: Task;
    columnId: string;
    setselectedLead: React.Dispatch<React.SetStateAction<boolean>>;
    setselectedLeadId: React.Dispatch<React.SetStateAction<string>>;
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
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const StatusIcon = task.status?.icon;
    const hasProgress = task.progress && task.progress.total > 0;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-background shrink-0 rounded-lg font-brcolage-grotesque overflow-hidden border border-border cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md
                ${isDragging ? "opacity-70 scale-[1.03] shadow-lg" : ""}
            `}
            onClick={() => {
                setselectedLead(true);
                setselectedLeadId(task.id);
            }}
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