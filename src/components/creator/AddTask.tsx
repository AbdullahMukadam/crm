
"use client"

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AddTaskModal({
    isOpen,
    onClose,
    columnTitle,
    handleSubmit,
    isLoading,
    username
}: {
    isOpen: boolean;
    onClose: () => void;
    columnTitle: string;
    handleSubmit: (e: any, formData: any) => Promise<void>
    isLoading: boolean,
    username: string
}) {
    const [name, setName] = useState("");
    const [companyName, setcompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setmobileNumber] = useState("");
    const [note, setnote] = useState("");

    // Reset form when modal opens/closes
    useEffect(() => {
        if(!isOpen) {
             setName("");
             setcompanyName("");
             setEmail("");
             setmobileNumber("");
             setnote("");
        }
    }, [isOpen]);

    const AddTask = async (e: any) => {
        const formData = {
            name,
            companyName,
            email,
            mobileNumber,
            note,
            username
        }
        await handleSubmit(e, formData)
    }

    // Handle Open Change for Shadcn
    const handleOpenChange = (open: boolean) => {
        if (!open) onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-zinc-900 border-zinc-700 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Task to {columnTitle}</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={AddTask} className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-zinc-300">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Enter Name"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="companyName" className="text-zinc-300">Company Name</Label>
                        <Input
                            id="companyName"
                            value={companyName}
                            onChange={(e) => setcompanyName(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Enter Company Name"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-zinc-300">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Enter Email"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="mobileNumber" className="text-zinc-300">Mobile Number</Label>
                        <Input
                            id="mobileNumber"
                            value={mobileNumber}
                            onChange={(e) => setmobileNumber(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Enter Mobile Number"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="note" className="text-zinc-300">Note</Label>
                        <Input
                            id="note"
                            value={note}
                            onChange={(e) => setnote(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Enter Note"
                            required
                        />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}