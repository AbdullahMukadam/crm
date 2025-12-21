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
import { InvoiceStatus, Project, ProjectStatus } from "@/types/project"
import { useAppDispatch } from "@/lib/store/hooks"
import { toast } from "sonner"
import { updateProject } from "@/lib/store/features/projectSlice"

interface CreateProjectDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    isUpdateLoading: boolean
    projects : Project[]
}

interface FormData {
    amount: string,
    invoiceNumber: string,
    projectId: string,
    status: InvoiceStatus,
    client: string
}

export function CreateInvoice({ open, onOpenChange, isUpdateLoading, projects }: CreateProjectDialogProps) {
    const [formData, setFormData] = useState<FormData>({
        amount: "",
        invoiceNumber: "",
        projectId : "NA",
        status: "DRAFT",
        client: "",
    })
    const dispatch = useAppDispatch()


    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
           
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
                    <DialogTitle className="text-foreground">Create Invoice</DialogTitle>
                    <DialogDescription>Create Invoice and send to your customer</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-foreground">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            placeholder="e.g., 500$"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="bg-background border-border"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="invoiceNumber" className="text-foreground">
                            Invoice Number
                        </Label>
                        <Input
                            id="invoiceNumber"
                            placeholder="e.g., 2"
                            value={formData.invoiceNumber}
                            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                            className="bg-background border-border"
                            required
                        />
                    </div>

                    <div className="space-y-2 w-full">
                        <Label htmlFor="projectId" className="text-foreground w-full">
                            Project
                        </Label>
                        <Select value={formData.projectId} onValueChange={(value) => setFormData({ ...formData, projectId: value })}>
                            <SelectTrigger id="projectId" className="bg-background border-border w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                {projects?.map((p) => (
                                    <SelectItem value={p.id}>{p.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-foreground">
                                Status
                            </Label>
                            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as InvoiceStatus })}>
                                <SelectTrigger id="status" className="bg-background border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="PAID">Paid</SelectItem>
                                    <SelectItem value="SENT">Sent</SelectItem>
                                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="client" className="text-foreground">
                                Recipient Name
                            </Label>
                            <Input
                                id="client"
                                placeholder="Client name"
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                className="bg-background border-border"
                                
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
                            {isUpdateLoading ? "Please wait" : "Create Invoice"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
