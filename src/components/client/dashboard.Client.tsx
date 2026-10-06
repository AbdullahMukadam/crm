"use client"
import { fetchProjects } from '@/lib/store/features/projectSlice'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { Figma, Layers, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { SectionCards } from './statusCards'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useProject } from '@/hooks/useProject'
import { FigmaEmbed } from '@/components/common/figmaEmbed' 
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'

function ClientDashboard() {
  const { projects, isLoading } = useAppSelector((state) => state.projects)
  const { username } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const [currentProjectName, setcurrentProjectName] = useState<string>("")
  const { currentProject, findCurrentProject } = useProject({ projects })

  useEffect(() => {
    if (projects.length === 0) dispatch(fetchProjects());
  }, [dispatch, projects.length]);

  useEffect(() => {
    if (projects.length > 0 && !currentProjectName) {
      setcurrentProjectName(projects[0].title);
    }
  }, [projects, currentProjectName]);

  useEffect(() => {
    if (currentProjectName) {
      findCurrentProject(currentProjectName)
    }
  }, [currentProjectName, findCurrentProject])

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="animate-spin mr-2" /> Loading dashboard...
      </div>
    );
  }

  // Handle case where user has no projects at all
  if (!isLoading && projects.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <PageHeader title={`Welcome back, ${username}`} />
        <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-border px-4 py-16 text-center">
          <Layers className="mb-3 size-6 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">No active projects</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            When a proposal you accept turns into a project, it shows up here.
          </p>
        </div>
      </div>
    )
  }

  return (
    // Replaced 'flex center' with standard dashboard layout classes
    <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 min-h-screen pb-20'>

      <PageHeader
        title={`Welcome back, ${username}`}
        description="Here's where your projects stand."
        actions={
          <Select value={currentProjectName} onValueChange={setcurrentProjectName}>
            <SelectTrigger size="sm" className="w-full sm:w-[240px]">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects?.map((p) => (
                <SelectItem key={p.id} value={p.title}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {/* DASHBOARD CONTENT */}
      <div className='flex flex-col gap-8'>

        {/* 1. Status Cards */}
        <section>
          <SectionCards project={currentProject} />
        </section>

        {/* 2. Design Preview */}
        <section className='space-y-4'>
          <div className="flex items-center justify-between">
            <h2 className='text-sm font-medium'>Design preview</h2>
            {currentProject?.embedLink && (
              <Button variant="outline" size="sm" asChild>
                <a href={currentProject.embedLink} target="_blank" rel="noreferrer">Open in Figma</a>
              </Button>
            )}
          </div>

          <div className="w-full aspect-video bg-muted/40 rounded-xl overflow-hidden border border-border">
            {currentProject?.embedLink ? (
              <FigmaEmbed
                src={currentProject.embedLink}

              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                <Figma className="size-6" />
                <p className="text-sm">No design preview for this project yet.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}

export default ClientDashboard