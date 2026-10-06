"use client";

import { useState } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

export default function AiProposalDialog({ onGenerated }: { onGenerated: (data: OutputData) => void }) {
    const [open, setOpen] = useState(false);
    const [brief, setBrief] = useState('');
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/ai/generate-proposal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brief }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message);
            onGenerated(json.data);
            toast.success('AI draft added to canvas');
            setOpen(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'AI generation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">AI Draft</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate proposal with AI</DialogTitle>
                    <DialogDescription>
                        Describe the client, the project, budget and timeline. The draft is added as an editable block.
                    </DialogDescription>
                </DialogHeader>
                <Textarea
                    rows={7}
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="e.g. Acme Corp needs a Shopify store redesign, ~40 products, launch in 6 weeks, budget around $4k..."
                />
                <DialogFooter>
                    <Button onClick={generate} disabled={loading || brief.trim().length < 10} className="gap-2">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        {loading ? 'Generating...' : 'Generate'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
