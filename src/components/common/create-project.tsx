"use client"

import type React from "react"

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Project, ProjectStatus } from "@/types/project"
import { useAppDispatch } from "@/lib/store/hooks"
import { toast } from "sonner"
import { updateProject } from "@/lib/store/features/projectSlice"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
  isUpdateLoading: boolean
}

interface FormData {
  title: string,
  description: string,
  status: ProjectStatus,
  client: string
}

export function EditProjectDialog({ open, onOpenChange, project, isUpdateLoading }: CreateProjectDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    status: "PLANNING",
    client: "",
  })
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title ?? "",
        description: project.description ?? "",
        status: (project.status ?? "PLANNING") as ProjectStatus,
        client: (project.client && (project.client as any).username) ?? "",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        status: "PLANNING",
        client: "",
      })
    }
  }, [project, open])

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const data = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        id : project?.id
      }
      const response = await dispatch(updateProject(data))
      if (updateProject.fulfilled.match(response)) {
        toast.success("Project Updated Successfully")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to Update the Project")
    } finally {
      onOpenChange(false)
    }
  }, [formData, open, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Update Project</DialogTitle>
          <DialogDescription>Start editing project collaboration. Fill in the project details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              Project Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., E-commerce Redesign"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-background border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the project..."
              value={formData.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
              className="bg-background border-border resize-none"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-foreground">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as ProjectStatus })}>
                <SelectTrigger id="status" className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="PLANNING">Planning</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client" className="text-foreground">
                Client
              </Label>
              <Input
                id="client"
                placeholder="Client name"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="bg-background border-border"
                disabled
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button disabled={isUpdateLoading} type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isUpdateLoading ? "Updating" : "Update Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
