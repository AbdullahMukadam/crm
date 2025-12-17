"use client"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import type { CreateFeedbackRequest, Feedback, Project, replyFeedbackRequest } from "@/types/project"
import { ArrowLeft, Loader2, MessageSquare, Paperclip, Send, X } from "lucide-react"
import { FormEvent, useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { getTimeAgo } from "../client/project-card"
import { toast } from "sonner"
import { createFeedback, fetchProject, findReviewProject, replyFeedback as replyFeedbackApi, updateProject } from "@/lib/store/features/projectSlice"
import { FigmaEmbed } from "./figmaEmbed"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useFeedbackStream } from "@/hooks/useFeedbackStream"


interface ReviewProjectComponentProps {
    projectId: string
}

function ReviewProjectComponent({ projectId }: ReviewProjectComponentProps) {
    const { projects, reviewProject, isLoading, isUpdateLoading } = useAppSelector((state) => state.projects)
    // const { feedback } = useFeedbackStream(projectId)
    const [comment, setComment] = useState("")
    const disptach = useAppDispatch()
    const [isOpen, setIsOpen] = useState(false)
    const [embedUrl, setEmbedUrl] = useState("")
    const [showReplyInput, setshowReplyInput] = useState(false)
    const [replyingFeedbackState, setreplyingFeedback] = useState<Feedback | null>(null)

    const handlefetchProject = useCallback(async (projectId: string) => {
        try {
            const response = await disptach(fetchProject({ id: projectId }))
            if (fetchProject.fulfilled.match(response)) {
                toast.success("Project fetched successfully")
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to fetch the project")
        }
    }, [disptach])

    useEffect(() => {
        if (!projectId) return;
        const projectInState = projects.find(p => p.id === projectId)
        
        if (projectInState) {
            disptach(findReviewProject({ id: projectId }))
        } else {
            disptach(fetchProject({ id: projectId }))
                .unwrap()
                .catch((error) => {
                    toast.error(error || "Unable to load project")
                })
        }
    }, [projectId, disptach])

    const now = getTimeAgo(reviewProject?.updatedAt || "")

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
    }, [projectId, embedUrl, disptach])

    const handdleCreateFeedback = useCallback(async () => {
        if (!comment || typeof comment !== "string") {
            return;
        }
        try {
            console.log(replyingFeedbackState)
            if (replyingFeedbackState && showReplyInput) {
                const data: Partial<replyFeedbackRequest> = {
                    message: comment,
                    id: projectId,
                    feedbackId: replyingFeedbackState.id
                }

                console.log("reply", data)
                const response = await disptach(replyFeedbackApi(data))
                if (replyFeedbackApi.fulfilled.match(response)) {
                    toast.success("Reply Added Successfully")
                }
            } else {
                const data: Partial<CreateFeedbackRequest> = {
                    message: comment,
                    id: projectId,
                }
                const response = await disptach(createFeedback(data))
                if (createFeedback.fulfilled.match(response)) {
                    toast.success("Feedback Created Successfully")
                }
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to Create the feedback")
        } finally {
            setComment("")
            setreplyingFeedback(null)
            setshowReplyInput(false)
        }
    }, [comment, projectId, replyingFeedbackState, showReplyInput, disptach])

    const handleReply = useCallback((feedback: Feedback) => {
        if (!feedback) return;
        setshowReplyInput(true)
        setreplyingFeedback(feedback)
    }, [])


    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-muted-foreground">
                <Loader2 className="animate-spin mr-2" /> Loading project...
            </div>
        )
    }

    return (
        <div className="w-full h-screen flex flex-col bg-background font-brcolage-grotesque overflow-hidden">
            <div className="flex-1 flex overflow-hidden">
                {/* Left panel - Project details */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
                        {/* Project header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Link href={"/dashboard"} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                    <ArrowLeft className="w-4 h-4" />
                                    <span className="text-sm font-medium">Back</span>
                                </Link>
                            </div>

                            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-3">
                                {reviewProject?.title || "FinTech Dashboard / Phase 2 - High Fidelity"}
                            </h1>

                            <div className="flex items-center gap-3 mb-4">
                                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                                    {reviewProject?.status || "Ready for Review"}
                                </Badge>
                                <span className="text-sm text-muted-foreground">Updated {now}</span>
                            </div>

                            <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                                {reviewProject?.description ||
                                    "This version includes the updated color palette for the dark mode toggle and the revised transaction history table. Please review the interaction states."}
                            </p>
                        </div>

                        {/* Figma embed area */}
                        <div className="w-full mb-8">
                            <div className="w-full aspect-video bg-muted/30 rounded-lg flex flex-col items-center justify-center gap-6 border border-border">
                                {!reviewProject?.embedLink ? (
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

                                        <div className="text-center px-4">
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
                                        src={reviewProject.embedLink || embedUrl}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right panel - Feedback */}
                <div className="w-full lg:w-96 border-l border-border bg-card flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-muted-foreground" />
                            <h2 className="font-semibold text-foreground">Feedback</h2>
                            <Badge variant="secondary" className="ml-1">
                                {reviewProject?.Feedback?.length || 0}
                            </Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="5" x2="17" y2="5" />
                                <line x1="3" y1="10" x2="17" y2="10" />
                                <line x1="3" y1="15" x2="17" y2="15" />
                            </svg>
                        </Button>
                    </div>

                    {/* Feedback list - Scrollable */}
                    <ScrollArea className="flex-1 overflow-y-auto">
                        <div className="p-4 space-y-6">
                            {reviewProject?.Feedback && reviewProject?.Feedback?.length > 0 ? (
                                reviewProject?.Feedback.map((feedback) => (
                                    <div key={feedback.id} className="space-y-3">
                                        {/* Main feedback */}
                                        <div className="flex gap-3">
                                            <Avatar className="w-8 h-8 flex-shrink-0">
                                                <AvatarImage src={feedback.author.avatarUrl || "/placeholder.svg"} />
                                                <AvatarFallback className="text-xs">
                                                    {feedback.author.username
                                                        .split(" ")
                                                        .map((n: any) => n[0])
                                                        .join("")
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="text-sm font-medium text-foreground truncate">{feedback.author.username}</span>
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{getTimeAgo(feedback.createdAt)}</span>
                                                </div>
                                                <p className="text-sm text-foreground leading-relaxed break-words">{feedback.message}</p>

                                                <button
                                                    className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                                    onClick={() => handleReply(feedback)}
                                                >
                                                    Reply
                                                </button>
                                            </div>
                                        </div>

                                        {/* Replies */}
                                        {feedback.replies && feedback.replies.length > 0 && (
                                            <div className="ml-11 space-y-3 pl-4 border-l-2 border-border">
                                                {feedback.replies.map((reply) => (
                                                    <div key={reply.id} className="flex gap-3">
                                                        <Avatar className="w-7 h-7 flex-shrink-0">
                                                            <AvatarImage src={reply.author.avatarUrl || "/placeholder.svg"} />
                                                            <AvatarFallback className="text-xs">
                                                                {reply.author.username
                                                                    .split(" ")
                                                                    .map((n: any) => n[0])
                                                                    .join("")
                                                                    .toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                                <span className="text-sm font-medium text-foreground truncate">{reply.author.username}</span>
                                                                <span className="text-xs text-muted-foreground whitespace-nowrap">{getTimeAgo(reply.createdAt)}</span>
                                                            </div>
                                                            <p className="text-sm text-foreground leading-relaxed break-words">{reply.message}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-full min-h-[200px] text-center">
                                    <p className="text-muted-foreground text-sm">No feedback provided yet</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Comment input - Fixed at bottom */}
                    <div className="p-4 border-t border-border space-y-3 flex-shrink-0 bg-card">
                        {showReplyInput && replyingFeedbackState && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-muted-foreground">Replying to:</span>
                                <Badge
                                    className="bg-accent text-xs font-normal cursor-pointer hover:bg-accent/80 max-w-[200px]"
                                    onClick={() => {
                                        setreplyingFeedback(null)
                                        setshowReplyInput(false)
                                    }}
                                >
                                    <X className="w-3 h-3 mr-1" />
                                    <span className="truncate">{replyingFeedbackState.message}</span>
                                </Badge>
                            </div>
                        )}

                        <div className="relative">
                            <Textarea
                                placeholder="Leave a comment... (Markdown supported)"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-[80px] pr-20 resize-none text-sm"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                        handdleCreateFeedback()
                                    }
                                }}
                            />
                            <div className="absolute bottom-2 right-2 flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Paperclip className="w-4 h-4" />
                                </Button>
                                <Button
                                    disabled={isUpdateLoading || !comment.trim()}
                                    size="sm"
                                    className="h-8"
                                    onClick={handdleCreateFeedback}
                                >
                                    {isUpdateLoading ? "Sending..." : "Send"}
                                    <Send className="w-3 h-3 ml-1" />
                                </Button>
                            </div>
                        </div>

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