
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Lead Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <Label htmlFor="companyName">Company Name</Label>
                    <h1 id="companyName">{selectedLeadData?.companyName || "Not Provided"}</h1>
                    <Label htmlFor="name"> Name</Label>
                    <h1 id="name">{selectedLeadData?.name || "Not Provided"}</h1>
                    <Label htmlFor="Email">Email</Label>
                    <h1 id="Email">{selectedLeadData?.email || "Not Provided"}</h1>
                    <Label htmlFor="Note">Note</Label>
                    <h1 id="Note">{selectedLeadData?.note || "Not Provided"}</h1>
                </div>
                <DialogFooter>
                    <Button disabled={isLoading} onClick={() => deleteLead(selectedLeadData?.id || "")}>Delete Lead</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
