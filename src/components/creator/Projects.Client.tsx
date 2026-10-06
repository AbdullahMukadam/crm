"use client"

import { useCallback, useEffect, useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
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
    <div className="min-h-screen bg-background w-full">
      {/* Standard container */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <PageHeader
          title="Projects"
          description={`${projects.length} ${projects.length === 1 ? "project" : "projects"} · ${projects.filter(p => p.status === "IN_PROGRESS").length} in progress`}
        >
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
            <TabsList variant="line" className="h-8 overflow-x-auto">
              <TabsTrigger className="flex-none px-2.5" value="all">All</TabsTrigger>
              <TabsTrigger className="flex-none px-2.5" value="active">In Progress</TabsTrigger>
              <TabsTrigger className="flex-none px-2.5" value="planning">Planning</TabsTrigger>
              <TabsTrigger className="flex-none px-2.5" value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8"
            />
          </div>
        </PageHeader>

        <div className="mt-6">
        {isLoading ? (
          <div className="w-full flex justify-center text-muted-foreground py-12">
            <Loader2 className="animate-spin mr-2" /> Loading projects...
          </div>
        ) : (
          <>
            {
              filteredProjects.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
                  {projects.length === 0 ? "No projects yet. They appear here when a client accepts a proposal." : "No projects match these filters."}
                </div>
              ) : (
                // Adjusted grid gap and column settings
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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