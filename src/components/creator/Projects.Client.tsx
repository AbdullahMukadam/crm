"use client"

import { useCallback, useEffect, useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { deleteProject, fetchProjects } from "@/lib/store/features/projectSlice"
import { ProjectCard } from "../client/project-card"
import { EditProjectDialog } from "../common/create-project"
import { Project } from "@/types/project"
import { toast } from "sonner"


type TabValue = "all" | "active" | "planning" | "completed"

export default function ProjectsClient() {
  const { projects, isLoading, error, isUpdateLoading } = useAppSelector((state) => state.projects)
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState<TabValue>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedProject, setselectedProject] = useState<Project | null>(null)

  useEffect(() => {
    if (projects.length === 0) dispatch(fetchProjects());
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && project.status === "IN_PROGRESS"
    if (activeTab === "planning") return matchesSearch && project.status === "PLANNING"
    if (activeTab === "completed") return matchesSearch && project.status === "COMPLETED"

    return matchesSearch
  })

  const handleDeleteProject = useCallback(async (id: string) => {
    try {
      const response = await dispatch(deleteProject({ id }))
      if (deleteProject.fulfilled.match(response)) {
        toast.success("Project deleted succesfully")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete the project")
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Your Projects</h1>
            <p className="text-muted-foreground">Manage and track the progress of your active collaborations.</p>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full lg:w-auto">
            <TabsList className="bg-muted">
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="w-full flex justify-center text-zinc-300">
            <Loader2 className="animate-spin mr-2" /> Loading projects...
          </div>
        ) : (
          <>
            {
              filteredProjects.length === 0 ? (
                <div className="flex items-center justify-center">
                  <h1 className="text-white font-brcolage-grotesque text-3xl text-center">No projects Found</h1>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      setIsCreateDialogOpen={setIsCreateDialogOpen}
                      setselectedProject={(p: Project) => setselectedProject(p)}
                      isLoading={isLoading}
                      handleDeleteProject={handleDeleteProject}
                    />
                  ))}

                </div>
              )
            }


            {filteredProjects.length > 6 && (
              <div className="mt-8 text-center">
                <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                  Show more projects
                </Button>
              </div>
            )}
          </>

        )}
      </div>

      <EditProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        project={selectedProject}
        isUpdateLoading={isUpdateLoading}
      />
    </div >
  )
}
