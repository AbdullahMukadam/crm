import { cn } from "@/lib/utils";

export interface Tone {
    dot: string;
    pill: string;
}

// One palette for every status/stage across the app
export const TONES = {
    amber: { dot: "bg-amber-500", pill: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
    sky: { dot: "bg-sky-500", pill: "bg-sky-500/10 text-sky-700 dark:text-sky-400" },
    violet: { dot: "bg-violet-500", pill: "bg-violet-500/10 text-violet-700 dark:text-violet-400" },
    pink: { dot: "bg-pink-500", pill: "bg-pink-500/10 text-pink-700 dark:text-pink-400" },
    emerald: { dot: "bg-emerald-500", pill: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
    red: { dot: "bg-red-500", pill: "bg-red-500/10 text-red-700 dark:text-red-400" },
    neutral: { dot: "bg-muted-foreground/60", pill: "bg-muted text-muted-foreground" },
} satisfies Record<string, Tone>;

export function StatusPill({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
    return (
        <span className={cn("inline-flex max-w-full items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium", tone.pill, className)}>
            <span className={cn("size-1.5 shrink-0 rounded-full", tone.dot)} />
            <span className="truncate">{children}</span>
        </span>
    );
}
