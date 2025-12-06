import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal } from "lucide-react";
import React from "react";

interface Task {
    id: string;
    title: string;
    description?: string;
}

function TaskCard({ task, columnId, setselectedLead, setselectedLeadId }: {
    task: Task;
    columnId: string;
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`group w-[200px] relative bg-zinc-800/80 backdrop-blur-sm p-4 rounded-xl border border-zinc-700 hover:border-zinc-600 transition-all duration-200 
        shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing
        ${isDragging ? "opacity-70 scale-[1.03] shadow-lg border-zinc-500" : ""}
      `}
        >
            {/* Title */}
            <h4 className="font-semibold text-zinc-100 tracking-tight mb-1">
                {task.title}
            </h4>

            {/* Description */}
            {task.description && (
                <p className="text-sm text-zinc-400 leading-snug line-clamp-2">
                    {task.description}
                </p>
            )}

            {/* More Options Button */}
            <button
                className="absolute top-2 right-2 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/60 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="More options"
                onClick={() => {
                    setselectedLead(true)
                    setselectedLeadId(task.id)
                }}
            >
                <MoreHorizontal size={16} />
            </button>
        </div>
    );
}

export default TaskCard;
