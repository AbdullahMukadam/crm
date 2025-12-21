import { Project } from "@/types/project"
import { useState } from "react";

interface useProjectProps {
    projects: Project[]
}
export function useProject({ projects }: useProjectProps) {
    const [currentProject, setcurrentProject] = useState<Project | null>(projects[0])

    function findCurrentProject(currentProjectName: string) {
        if (!projects) return null;

        let project = projects.find((p) => p.title === currentProjectName)
        if (project) {
            setcurrentProject(project)
        }
    }

    return {
        findCurrentProject,
        currentProject
    }
}