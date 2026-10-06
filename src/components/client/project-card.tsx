import { MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { StatusPill, TONES } from "@/components/ui/status-pill"
import { Project, ProjectStatus } from "@/types/project"
import { SetStateAction } from "react"
import { useRouter } from "next/navigation"

interface ProjectCardProps {
  project: Project,
  setIsCreateDialogOpen: React.Dispatch<SetStateAction<boolean>>
  setselectedProject?: (project: Project) => void;
  isLoading: boolean
  handleDeleteProject: (id: string) => Promise<void>
}

export const statusConfig = {
  PLANNING: { label: "Planning", tone: TONES.amber },
  IN_PROGRESS: { label: "In Progress", tone: TONES.sky },
  COMPLETED: { label: "Completed", tone: TONES.emerald },
  CANCELED: { label: "Canceled", tone: TONES.red },
}

export const getProgress = (progress: ProjectStatus) => {
  if (progress === "IN_PROGRESS") return 45
  if (progress === "PLANNING") return 30
  if (progress === "CANCELED") return 0
  if (progress === "COMPLETED") return 100
}

export function ProjectCard({ project, setIsCreateDialogOpen, setselectedProject, isLoading, handleDeleteProject }: ProjectCardProps) {
  const config = statusConfig[project.status]
  const progress = getProgress(project.status) ?? 0
  const router = useRouter()

  return (
    <div
      className="group flex w-full cursor-pointer flex-col rounded-lg border border-border bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[box-shadow,border-color] duration-150 hover:border-foreground/15 hover:shadow-sm"
      onClick={() => router.push(`/review-project/${project.id}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <StatusPill tone={config.tone}>{config.label}</StatusPill>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="-mr-1.5 -mt-1 size-7 text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
              aria-label="Project options"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem className="cursor-pointer" onClick={() => {
              setselectedProject?.(project);
              setIsCreateDialogOpen(true)
            }}>Edit project</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/review-project/${project.id}`)}>View details</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDeleteProject(project.id)} disabled={isLoading}>{isLoading ? "Please wait" : "Delete"}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="mt-3 text-sm font-medium leading-snug text-foreground break-words">{project.title}</h3>
      {project.description && (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2 break-words">{project.description}</p>
      )}

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium tabular-nums text-foreground">{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className={`h-full rounded-full ${config.tone.dot}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div className="flex -space-x-1.5">
          <Avatar className="size-6 ring-2 ring-card" title={project.creator.username}>
            <AvatarImage src={project.creator.avatarUrl || "/auth-image.jpg"} />
            <AvatarFallback className="text-[10px]">{project.creator.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <Avatar className="size-6 ring-2 ring-card" title={project.client.username}>
            <AvatarImage src={project.client.avatarUrl || "/auth-image.jpg"} />
            <AvatarFallback className="text-[10px]">{project.client.username.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">Updated {getTimeAgo(project.updatedAt)}</span>
      </div>
    </div>
  )
}

export function getTimeAgo(dateInput: Date | string): string {
  const date = new Date(dateInput);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;

  return date.toLocaleDateString();
}
