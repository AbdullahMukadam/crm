import { MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Project, ProjectStatus } from "@/types/project"
import { SetStateAction } from "react"

interface ProjectCardProps {
  project: Project,
  setIsCreateDialogOpen: React.Dispatch<SetStateAction<boolean>>

}

const statusConfig = {
  IN_PROGRESS: { label: "IN PROGRESS", color: "bg-primary text-primary-foreground", dotColor: "bg-primary" },
  PLANNING: { label: "PLANNING", color: "bg-orange-500 text-white", dotColor: "bg-orange-300" },
  COMPLETED: { label: "COMPLETED", color: "bg-emerald-500 text-white", dotColor: "bg-emerald-500" },
  CANCELED: { label: "CANCELED", color: "bg-red-500 text-white", dotColor: "bg-red-300" },
}

const getProgressColor = (progress: ProjectStatus) => {
  if (progress === "IN_PROGRESS") return "bg-emerald-500"
  if (progress === "PLANNING") return "bg-orange-500"
  if (progress === "CANCELED") return "bg-red-500"
  if (progress === "COMPLETED") return "bg-emerald-500"
  return "bg-yellow-500"
}

const getProgress = (progress: ProjectStatus) => {
  if (progress === "IN_PROGRESS") return 30
  if (progress === "PLANNING") return 45
  if (progress === "CANCELED") return 0
  if (progress === "COMPLETED") return 100
}

export function ProjectCard({ project, setIsCreateDialogOpen }: ProjectCardProps) {
  const config = statusConfig[project.status]
  const now = getTimeAgo(project.updatedAt)

  return (
    <Card className="hover:shadow-lg transition-shadow border-border font-brcolage-grotesque">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <Badge className={`${config.color} text-xs font-semibold`}>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} inline-block mr-1.5`}></span>
          {config.label}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8 -mr-2">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem className="hover:bg-muted cursor-pointer" onClick={() => setIsCreateDialogOpen(prev => !prev)}>Edit Project</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted cursor-pointer">View Details</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted cursor-pointer text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-bold text-foreground text-lg mb-2">{project.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Progress</span>
            <span
              className={`text-xs font-bold ${getProgressColor(project.status) === "bg-emerald-500" ? "text-emerald-600" : "text-primary"}`}
            >
              {getProgress(project.status)}%
            </span>
          </div>
          <Progress value={getProgress(project.status)} className="h-2 bg-muted" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex -space-x-2">
            <Avatar className="w-8 h-8 border-2 border-card">
              <AvatarImage src={project.creator.avatarUrl || "/auth-image.jpg"} />
              <AvatarFallback className="text-xs">{project.creator.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8 border-2 border-card">
              <AvatarImage src={project.creator.avatarUrl || "/auth-image.jpg"} />
              <AvatarFallback className="text-xs">{project.client.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <span className="text-xs text-muted-foreground">{now}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function getTimeAgo(dateInput: Date | string): string {
  // 1. Ensure we have a valid Date object
  const date = new Date(dateInput);
  const now = new Date();

  // 2. Perform the calculation
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;

  return date.toLocaleDateString();
}
