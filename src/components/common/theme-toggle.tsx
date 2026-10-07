"use client"

import { useEffect, useState } from "react"
import { flushSync } from "react-dom"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const THEMES = [
    { key: "system", label: "System theme", icon: Monitor },
    { key: "light", label: "Light theme", icon: Sun },
    { key: "dark", label: "Dark theme", icon: Moon },
] as const

// Three-option switcher with a sliding indicator; next-themes stays the single source of truth
export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const select = (key: string) => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (!document.startViewTransition || reduceMotion) {
            setTheme(key)
            return
        }
        // flushSync applies the new theme class inside the transition, so the browser cross-fades old -> new
        document.startViewTransition(() => flushSync(() => setTheme(key)))
    }

    // Theme is only known on the client; until then the pill sits nowhere (same size, no layout shift)
    const activeIndex = mounted ? THEMES.findIndex((t) => t.key === theme) : -1

    return (
        <fieldset aria-label="Theme switcher" className="relative m-0 inline-flex min-w-0 items-center rounded-full border border-border bg-background p-1">
            <span
                aria-hidden
                className={cn(
                    "absolute left-1 top-1 size-6 rounded-full bg-muted transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    activeIndex < 0 && "opacity-0"
                )}
                style={{ transform: `translateX(${Math.max(0, activeIndex) * 24}px)` }}
            />
            {THEMES.map(({ key, label, icon: Icon }, i) => (
                <button
                    key={key}
                    type="button"
                    aria-label={label}
                    aria-pressed={i === activeIndex}
                    onClick={() => select(key)}
                    className={cn(
                        "relative inline-flex size-6 cursor-pointer items-center justify-center rounded-full transition-colors",
                        i === activeIndex ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Icon className="size-3.5" />
                </button>
            ))}
        </fieldset>
    )
}
