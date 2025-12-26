"use client"

import type React from "react"
import { type FormEvent, useCallback, useEffect, useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type CreateInvoiceRequest, type InvoiceStatus, type Project } from "@/types/project"
import { useAppDispatch } from "@/lib/store/hooks"
import { toast } from "sonner"
import { CalendarComp } from "@/components/ui/date-pcker"
import { editInvoiceSlice } from "@/lib/store/features/projectSlice"

// Define the shape of the Invoice object you are passing
// (You should ideally import this from your types file)
interface Invoice {
    id: string
    invoiceNumber: string
    amount: number | string
    status: InvoiceStatus
    dueDate: string | Date
    projectId: string
    client?: { id: string }
    clientId?: string
}

interface EditInvoiceProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    isInvoiceLoading: boolean
    projects: Project[]
    invoice: Invoice | null // The invoice to edit
}

interface FormData {
    amount: string
    invoiceNumber: string
    projectId: string
    status: InvoiceStatus
}

export function EditInvoice({ open, onOpenChange, isInvoiceLoading, projects, invoice }: EditInvoiceProps) {
    const [formData, setFormData] = useState<FormData>({
        amount: "",
        invoiceNumber: "",
        projectId: "",
        status: "DRAFT",
    })
    const [date, setDate] = useState<Date | undefined>(undefined)
    const dispatch = useAppDispatch()

    // --- POPULATE FORM DATA ---
    useEffect(() => {
        if (invoice && open) {
            setFormData({
                amount: invoice.amount.toString(),
                invoiceNumber: invoice.invoiceNumber,
                projectId: invoice.projectId,
                status: invoice.status as InvoiceStatus,
            })
            setDate(new Date(invoice.dueDate))
        }
    }, [invoice, open])

    const handleSubmit = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            if (!invoice) return

            try {
                const project = projects?.find((p) => p.id === formData.projectId)
                const data = {
                    id: invoice.id,
                    invoiceNumber: formData.invoiceNumber,
                    amount: parseInt(formData.amount),
                    projectId: formData.projectId,
                    status: formData.status,
                    clientId: project?.clientId || project?.client.id, // Fallback logic
                    dueDate: date || new Date(),
                }

                const response = await dispatch(editInvoiceSlice(data))

                if (editInvoiceSlice.fulfilled.match(response)) {
                    toast.success("Invoice Updated Successfully")
                    onOpenChange(false)
                } else {
                    toast.error("Failed to update invoice")
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to Update the Invoice")
            }
        },
        [formData, date, invoice, projects, dispatch, onOpenChange],
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Edit Invoice</DialogTitle>
                    <DialogDescription>Update invoice details.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-foreground">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            placeholder="e.g., 500"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="bg-background border-border"
                            required
                            type="number"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="invoiceNumber" className="text-foreground">
                            Invoice Number
                        </Label>
                        <Input
                            id="invoiceNumber"
                            placeholder="e.g., INV-001"
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
                        <Select
                            required
                            value={formData.projectId}
                            onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                        >
                            <SelectTrigger id="projectId" className="bg-background border-border w-full">
                                <SelectValue placeholder="Select Project" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                {projects?.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-foreground">
                                Status
                            </Label>
                            <Select
                                required
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value as InvoiceStatus })}
                            >
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
                            <CalendarComp date={date} setDate={setDate} />
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
                        <Button
                            disabled={isInvoiceLoading}
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {isInvoiceLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}