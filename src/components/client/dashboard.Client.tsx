"use client"
import { fetchProjects } from '@/lib/store/features/projectSlice'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { Figma, Layers, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { SectionCards } from './statusCards' // Assuming this is the file name
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useProject } from '@/hooks/useProject'
import { FigmaEmbed } from '@/components/common/figmaEmbed' // Fixed path based on standard conventions
import { Button } from '@/components/ui/button'

function ClientDashboard() {
  const { projects, isLoading } = useAppSelector((state) => state.projects)
  const { username } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  // Safe initialization: Don't access projects[0] directly in useState
  const [currentProjectName, setcurrentProjectName] = useState<string>("")

  const { currentProject, findCurrentProject } = useProject({ projects })

  // 1. Fetch Projects on mount
  useEffect(() => {
    if (projects.length === 0) dispatch(fetchProjects());
  }, [dispatch, projects.length]);

  // 2. Set Default Project when projects load
  useEffect(() => {
    if (projects.length > 0 && !currentProjectName) {
      setcurrentProjectName(projects[0].title);
    }
  }, [projects, currentProjectName]);

  // 3. Update hook when selection changes
  useEffect(() => {
    if (currentProjectName) {
      findCurrentProject(currentProjectName)
    }
  }, [currentProjectName, findCurrentProject])

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-zinc-950 text-zinc-300">
        <Loader2 className="animate-spin mr-2" /> Loading dashboard...
      </div>
    );
  }

  // Handle case where user has no projects at all
  if (!isLoading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        {/* Icon with glowing effect */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
          <div className="relative p-6 bg-zinc-900 rounded-2xl ring-1 ring-white/10 shadow-2xl">
            <Layers className="h-10 w-10 text-red-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
          No Active Projects
        </h2>

        <p className="text-zinc-400 max-w-[400px] text-base leading-relaxed mb-8">
          It looks quiet here. You are not currently assigned to any active projects.
        </p>

        {/* Action Button - highly recommended for empty states */}
        <div className="flex gap-3">
          <Button variant="outline">Refresh</Button>
        </div>
      </div>
    )
  }

  return (
    // Replaced 'flex center' with standard dashboard layout classes
    <div className='container max-w-7xl mx-auto p-4 md:p-8 font-brcolage-grotesque space-y-8 min-h-screen pb-20'>

      {/* HEADER SECTION */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6'>
        <div className="space-y-1">
          <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>Welcome back, {username}</h1>
          <p className="text-muted-foreground">Here is what's happening with your projects today.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground hidden md:block">Project:</span>
          <Select value={currentProjectName} onValueChange={setcurrentProjectName}>
            <SelectTrigger className="w-full md:w-[280px] bg-background">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects?.map((p) => (
                <SelectItem key={p.id} value={p.title}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* DASHBOARD CONTENT */}
      <div className='flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>

        {/* 1. Status Cards */}
        <section>
          <SectionCards project={currentProject} />
        </section>

        {/* 2. Design Preview */}
        <section className='space-y-4'>
          <div className="flex items-center justify-between">
            <h2 className='text-xl font-semibold flex items-center gap-2'>
              <Figma className="h-5 w-5 text-purple-500" />
              Design Preview
            </h2>
            {currentProject?.embedLink && (
              <Button variant="outline" size="sm" asChild>
                <a href={currentProject.embedLink} target="_blank" rel="noreferrer">Open in Figma</a>
              </Button>
            )}
          </div>

          <div className="w-full aspect-video bg-muted/40 rounded-xl overflow-hidden border shadow-sm">
            {currentProject?.embedLink ? (
              <FigmaEmbed
                src={currentProject.embedLink}

              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                <Figma className="h-10 w-10 opacity-20" />
                <p>No design preview available for this project yet.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}

export default ClientDashboard