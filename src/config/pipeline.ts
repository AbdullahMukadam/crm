import { TONES, type Tone } from "@/components/ui/status-pill";

export const COLUMN_DEFINITIONS: { id: string; title: string; tone: Tone }[] = [
    { id: 'new-lead', title: 'New', tone: TONES.amber },
    { id: 'contacted', title: 'Contacted', tone: TONES.sky },
    { id: 'qualified', title: 'Qualified', tone: TONES.violet },
    { id: 'proposal-sent', title: 'Proposal Sent', tone: TONES.pink },
    { id: 'won', title: 'Won', tone: TONES.emerald },
];
