"use client"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import type { Project } from "@/types/project"
import { ArrowLeft, Bell, ChevronRight, Loader2, MessageSquare, Paperclip, Send } from "lucide-react"
import { FormEvent, useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { getTimeAgo } from "../client/project-card"
import { toast } from "sonner"
import { fetchProject, updateProject } from "@/lib/store/features/projectSlice"
import { FigmaEmbed } from "./figmaEmbed"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

interface Feedback {
    id: string
    author: string
    avatar: string
    timestamp: string
    message: string
    frame?: string
    replies?: Feedback[]
}

interface ReviewProjectComponentProps {
    projectId: string
}

function ReviewProjectComponent({ projectId }: ReviewProjectComponentProps) {
    const { projects, isLoading, isUpdateLoading } = useAppSelector((state) => state.projects)
    const [projectData, setprojectData] = useState<Project | null>(null)
    const [comment, setComment] = useState("")
    const disptach = useAppDispatch()
    const [isOpen, setIsOpen] = useState(false)
    const [embedUrl, setEmbedUrl] = useState("")

    const [feedbackList] = useState<Feedback[]>([
        {
            id: "1",
            author: "Mark Davis",
            avatar: "/diverse-group.png",
            timestamp: "2h ago",
            message:
                "The contrast on these secondary buttons feels a bit low. Can we bump up the opacity or try a darker shade?",
            frame: "Frame 142 • Button",
            replies: [
                {
                    id: "2",
                    author: "Sarah Chen",
                    avatar: "/diverse-woman-portrait.png",
                    timestamp: "1h ago",
                    message: "Good catch. I've updated the slate-200 to slate-300 in the latest push. Does that work better?",
                },
                {
                    id: "3",
                    author: "Mark Davis",
                    avatar: "/diverse-group.png",
                    timestamp: "35m ago",
                    message: "Yes, much better. Let's lock that in. Also, the spacing on the header looks perfect now.",
                },
            ],
        },
    ])

    const handlefetchProject = useCallback(async (projectId: string) => {
        try {
            const response = await disptach(fetchProject({ id: projectId }))
            if (fetchProject.fulfilled.match(response)) {
                toast.success("Project fetched successfully")
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to fetch the project")
        }
    }, [])

    useEffect(() => {
        const handlefetch = async () => {
            if (!projectId) return

            const project = projects.filter((p) => p.id === projectId)
            if (project) {
                setprojectData(project[0])
            } else {
                await handlefetchProject(projectId)
            }
        }

        handlefetch()
    }, [projectId, projects])
    const now = getTimeAgo(projectData?.updatedAt || "")

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            if (!embedUrl) return;
            const data = {
                id: projectId,
                embedLink: embedUrl
            }
            const response = await disptach(updateProject(data))
            if (updateProject.fulfilled.match(response)) {
                toast.success("Added the Embed Url")
                setIsOpen(false)
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to Add the embed url")
        }
    }, [projectId, embedUrl],)


    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Loader2 className="animate-spin mr-2" /> Loading project...
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col bg-background font-brcolage-grotesque mb-0">

            <div className="flex-1 h-full flex">
                {/* Left panel - Project details */}
                <div className="flex-1 h-full">
                    <div className="p-8 max-w-4xl mx-auto">
                        {/* Project header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Link href={"/dashboard"} className="flex gap-2 text-gray-600">
                                    <ArrowLeft />
                                    Back
                                </Link>
                                <h1 className="text-3xl font-semibold text-foreground">
                                    {projectData?.title || "FinTech Dashboard / Phase 2 - High Fidelity"}
                                </h1>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                                    {projectData?.status || "Ready for Review"}
                                </Badge>
                                <span className="text-sm text-muted-foreground">Updated {now}</span>
                            </div>

                            <p className="text-muted-foreground leading-relaxed">
                                {projectData?.description ||
                                    "This version includes the updated color palette for the dark mode toggle and the revised transaction history table. Please review the interaction states."}
                            </p>
                        </div>

                        {/* Figma embed area */}
                        <div className="w-full aspect-video bg-muted/30 rounded-lg flex flex-col items-center justify-center gap-6 border border-border">
                            {!projectData?.embedLink ? (
                                <>
                                    <div className="w-16 h-16 text-muted-foreground">
                                        <svg viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z"
                                                fill="currentColor"
                                                fillOpacity="0.4"
                                            />
                                            <path
                                                d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"
                                                fill="currentColor"
                                                fillOpacity="0.4"
                                            />
                                            <path
                                                d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z"
                                                fill="currentColor"
                                                fillOpacity="0.4"
                                            />
                                            <path
                                                d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z"
                                                fill="currentColor"
                                                fillOpacity="0.4"
                                            />
                                            <path
                                                d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z"
                                                fill="currentColor"
                                                fillOpacity="0.4"
                                            />
                                        </svg>
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-lg font-medium text-foreground mb-2">Interactive Figma Embed</h3>
                                        <p className="text-sm text-muted-foreground mb-6 max-w-md">
                                            Interact with the high-fidelity prototype directly in this window to leave context-aware comments.
                                        </p>
                                        <Button onClick={() => setIsOpen(true)} size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                                            Add the Link
                                        </Button>
                                    </div>

                                </>
                            ) : (
                                <FigmaEmbed
                                    src={projectData.embedLink || embedUrl}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right panel - Feedback */}
                <div className="w-96 h-full border-l border-border bg-card flex flex-col">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-muted-foreground" />
                            <h2 className="font-semibold text-foreground">Feedback</h2>
                            <Badge variant="secondary" className="ml-1">
                                3
                            </Badge>
                        </div>
                        <Button variant="ghost" size="icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="5" x2="17" y2="5" />
                                <line x1="3" y1="10" x2="17" y2="10" />
                                <line x1="3" y1="15" x2="17" y2="15" />
                            </svg>
                        </Button>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-4">
                            {feedbackList.map((feedback) => (
                                <div key={feedback.id} className="space-y-4">
                                    <div className="flex gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={feedback.avatar || "/placeholder.svg"} />
                                            <AvatarFallback>
                                                {feedback.author
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-foreground">{feedback.author}</span>
                                                <span className="text-xs text-muted-foreground">{feedback.timestamp}</span>
                                            </div>
                                            <p className="text-sm text-foreground leading-relaxed">{feedback.message}</p>
                                            {feedback.frame && (
                                                <Badge variant="secondary" className="text-xs">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5" />
                                                    {feedback.frame}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Replies */}
                                    {feedback.replies?.map((reply) => (
                                        <div key={reply.id} className="flex gap-3 ml-11">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={reply.avatar || "/placeholder.svg"} />
                                                <AvatarFallback>
                                                    {reply.author
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-foreground">{reply.author}</span>
                                                    <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                                                </div>
                                                <p className="text-sm text-foreground leading-relaxed">{reply.message}</p>
                                                {reply.id === "3" && (
                                                    <div className="flex gap-2 text-xs text-muted-foreground">
                                                        <button className="hover:text-foreground transition-colors">Reply</button>
                                                        <button className="hover:text-foreground transition-colors">Resolve</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    {/* Comment input */}
                    <div className="p-4 border-t border-border space-y-3">
                        <div className="relative border border-zinc-700 rounded-md">
                            <Textarea
                                placeholder="Leave a comment... (Markdown supported)"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-[80px] pr-20 resize-none"
                            />
                            <div className="absolute bottom-2 right-2 flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Paperclip className="w-4 h-4" />
                                </Button>
                                <Button size="sm" className="h-8">
                                    Send
                                    <Send className="w-3 h-3 ml-1" />
                                </Button>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve Design
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Add the Embed Link</DialogTitle>
                        <DialogDescription>Start with adding the figma url, so that Client can review</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="link" className="text-foreground">
                                Link
                            </Label>
                            <Input
                                id="link"
                                placeholder="https://embed.figma.com/design/..."
                                value={embedUrl}
                                onChange={(e) => setEmbedUrl(e.target.value)}
                                className="bg-background border-border"
                                required
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="border-border text-foreground hover:bg-muted"
                            >
                                Cancel
                            </Button>
                            <Button disabled={isUpdateLoading} type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                {isUpdateLoading ? "Adding..." : "Add Url"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ReviewProjectComponent
