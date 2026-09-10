
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LeadsDataForDashboard } from "@/types/branding";

interface LeadsDetailsProps {
    selectedLead: boolean;
    selectedLeadData: LeadsDataForDashboard | null;
    onOpenChnage: React.Dispatch<React.SetStateAction<boolean>>
    deleteLead: (id: string) => Promise<void>
    isLoading: boolean

}

export function LeadsDetails({ selectedLead, selectedLeadData, onOpenChnage, deleteLead, isLoading }: LeadsDetailsProps) {
    return (
        <Dialog open={selectedLead} onOpenChange={onOpenChnage}>
            <DialogContent className="bg-card border-border sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Lead Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="companyName">Company Name</Label>
                        <p id="companyName" className="text-sm font-medium">{selectedLeadData?.companyName || "Not Provided"}</p>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <p id="name" className="text-sm font-medium">{selectedLeadData?.name || "Not Provided"}</p>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="Email">Email</Label>
                        <p id="Email" className="text-sm font-medium">{selectedLeadData?.email || "Not Provided"}</p>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="Note">Note</Label>
                        <p id="Note" className="text-sm text-muted-foreground">{selectedLeadData?.note || "Not Provided"}</p>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                    <Button variant="destructive" disabled={isLoading} onClick={() => deleteLead(selectedLeadData?.id || "")}>
                        Delete Lead
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
