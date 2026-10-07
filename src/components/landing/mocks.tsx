"use client"

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { DndContext } from '@dnd-kit/core'
import { Bell, Figma, Link as LinkIcon, MoreHorizontal, MoreVertical, PanelLeftClose, Plus, Save, Search, Sparkles } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/ui/page-header'
import { StatusPill, TONES } from '@/components/ui/status-pill'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { TaskCardBody } from '@/components/creator/TaskCard'
import ProposalSidebar from '@/components/creator/proposalSidebar'
import { SectionCards } from '@/components/client/statusCards'
import { COLUMN_DEFINITIONS } from '@/config/pipeline'
import { ProposalBuilderBlocks } from '@/config/proposalsBluiderConfig'
import { CreatorSidebarItems } from '@/config/sidebarConfig'
import { cn } from '@/lib/utils'
import type { LeadsDataForDashboard } from '@/types/branding'
import type { Block } from '@/types/proposal'
import type { Project } from '@/types/project'

// Same loading strategy as the proposal viewer (Editor.js can't render on the server)
const BlockRenderer = dynamic(() => import('@/components/creator/blockRenderer').then((m) => m.BlockRenderer), { ssr: false })

const noop = () => { }

// ---------- Shared frame ----------

// `width` renders the real app layout at that size, then zooms it down to fit narrower screens
function Frame({ children, className, width }: { children: React.ReactNode; className?: string; width?: number }) {
    const outer = useRef<HTMLDivElement>(null)
    const [zoom, setZoom] = useState(1)

    useLayoutEffect(() => {
        const el = outer.current
        if (!width || !el) return
        const observer = new ResizeObserver(([entry]) => setZoom(Math.min(1, entry.contentRect.width / width)))
        observer.observe(el)
        return () => observer.disconnect()
    }, [width])

    return (
        <div ref={outer} className="overflow-hidden rounded-xl border border-border bg-background shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)]">
            <div inert className={cn('font-sans text-foreground', className)} style={width ? { width, zoom } : undefined}>
                {children}
            </div>
        </div>
    )
}

// Renders children only after mount; for real components that format dates with the viewer's locale
function ClientOnly({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    return mounted ? children : fallback
}

// ---------- Sample data ----------

const lead = (id: string, name: string, companyName: string | null, status: string, note: string | null, mobileNumber: string | null = null): LeadsDataForDashboard => ({
    id, name, companyName, status, note, mobileNumber,
    email: `${name.split(' ')[0].toLowerCase()}@${(companyName ?? 'gmail').toLowerCase().replace(/\s+/g, '')}.com`,
    createdAt: new Date('2026-09-28T10:00:00Z'), updatedAt: new Date('2026-09-28T10:00:00Z'), userId: null,
})

const leads = [
    lead('1', 'Sarah Lee', 'Northwind', 'new-lead', 'Full rebrand before our Q1 launch, budget around $6k.'),
    lead('2', 'Tom Ford', 'Acme Co', 'new-lead', null, '+1 415 555 0134'),
    lead('3', 'Priya Shah', 'Globex', 'contacted', 'Landing page + 3 product screens.'),
    lead('4', 'Leo Park', null, 'qualified', 'Personal portfolio site.'),
    lead('5', 'Ana Ruiz', 'Umbrella', 'proposal-sent', 'Design system audit.'),
    lead('6', 'Mia Chen', 'Hooli', 'won', null),
]

const sampleProject = {
    id: 'p1', title: 'Northwind rebrand', status: 'IN_PROGRESS', description: null,
    updatedAt: new Date('2026-10-02T10:00:00Z'), createdAt: new Date('2026-09-20T10:00:00Z'),
    deliverables: [
        { id: 'd1', status: 'approved' }, { id: 'd2', status: 'approved' }, { id: 'd3', status: 'pending_review' },
    ],
    invoices: [
        { id: 'i1', amount: 3200, status: 'PAID' }, { id: 'i2', amount: 3300, status: 'SENT' },
    ],
} as unknown as Project

// ---------- App shell (copies of sidebar.tsx and header.tsx markup) ----------

function ShellSidebar({ active }: { active: string }) {
    return (
        <aside className="flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
            <div className="flex h-14 items-center justify-between px-3 pl-4">
                <span className="text-base font-semibold tracking-tight text-foreground">StudioFlow</span>
                <span className="flex size-8 items-center justify-center text-muted-foreground"><PanelLeftClose className="size-4" /></span>
            </div>
            <div className="px-3">
                <div className="flex w-full items-center gap-2.5 rounded-lg border border-sidebar-border bg-background/40 p-2">
                    <Avatar className="size-8">
                        <AvatarImage src="/auth-image.jpg" alt="" />
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col">
                        <p className="truncate text-sm font-medium text-foreground">Alex Morgan</p>
                        <p className="truncate text-xs text-muted-foreground">alex@morgan.studio</p>
                    </div>
                    <MoreVertical className="size-4 shrink-0 text-muted-foreground" />
                </div>
            </div>
            <nav className="flex-1 px-3 pt-5">
                <p className="px-2.5 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">Menu</p>
                <div className="space-y-0.5">
                    {CreatorSidebarItems.map((item) => (
                        <div
                            key={item.href}
                            className={cn(
                                'relative flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm text-muted-foreground',
                                item.label === active && 'bg-background font-medium text-foreground shadow-xs ring-1 ring-sidebar-border before:absolute before:-left-3 before:h-5 before:w-0.5 before:rounded-r before:bg-primary'
                            )}
                        >
                            <item.icon className="size-4 shrink-0" />
                            <span className="truncate">{item.label}</span>
                        </div>
                    ))}
                </div>
            </nav>
        </aside>
    )
}

function ShellHeader() {
    return (
        <header className="flex h-14 items-center justify-end gap-3 border-b border-border bg-background/90 px-8">
            <div className="flex w-72 items-center gap-2 rounded-lg border border-input bg-background px-3 text-muted-foreground">
                <Search size={16} className="shrink-0" />
                <span className="p-1.5 text-sm">Search leads</span>
            </div>
            <ThemeToggle />
            <span className="relative flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground">
                <Bell className="size-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">2</span>
            </span>
        </header>
    )
}

// ---------- Hero: creator dashboard with the leads pipeline ----------

export function DashboardMock() {
    return (
        <Frame width={1120} className="flex h-[640px]">
            <ShellSidebar active="Dashboard" />
            <div className="flex min-w-0 flex-1 flex-col">
                <ShellHeader />
                <div className="space-y-6 px-8 py-8">
                    <PageHeader
                        title="Leads Pipeline"
                        description={<>{leads.length} leads &middot; 1 won</>}
                        actions={<Button size="sm" className="gap-1.5"><Plus className="size-4" /> Add lead</Button>}
                    />
                    {/* Copy of kanbanColoumn.tsx markup (the real one needs drag-and-drop context) */}
                    <div className="flex gap-3">
                        {COLUMN_DEFINITIONS.map((col) => {
                            const tasks = leads.filter((l) => l.status === col.id)
                            return (
                                <div key={col.id} className="flex w-[300px] shrink-0 flex-col rounded-xl bg-muted/60 p-2">
                                    <div className="mb-1 flex items-center justify-between px-1.5 py-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className={`size-2 rounded-full ${col.tone.dot}`} />
                                            <span className="text-sm font-medium text-foreground">{col.title}</span>
                                            <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white ${col.tone.dot}`}>{tasks.length}</span>
                                        </div>
                                        <div className="flex items-center gap-0.5 text-muted-foreground">
                                            <span className="flex size-6 items-center justify-center"><Plus className="size-4" /></span>
                                            <span className="flex size-6 items-center justify-center"><MoreHorizontal className="size-4" /></span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {tasks.map((t) => <TaskCardBody key={t.id} lead={t} tone={col.tone} />)}
                                    </div>
                                    <span className="mt-1.5 inline-flex items-center gap-1.5 px-1.5 py-1.5 text-xs font-medium text-muted-foreground"><Plus className="size-3.5" /> Add lead</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Frame>
    )
}

// ---------- Intake: public lead form (ui/form.tsx) + notifications (header.tsx) ----------

export function IntakeMock() {
    const notifications = [
        { title: 'New lead', message: 'Sarah Lee from Northwind filled in your lead form', time: 'just now', unread: true },
        { title: 'Proposal Accepted!', message: 'Your proposal "App UI redesign" has been Accepted!', time: '2h ago', unread: true },
        { title: 'New lead', message: 'Tom Ford from Acme Co filled in your lead form', time: '1d ago', unread: false },
    ]
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Frame className="flex justify-center bg-background p-4 sm:p-6">
                <Card className="w-full max-w-md border-border bg-card/80 p-6 shadow-2xl sm:p-8">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Get in Touch</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Fill out the form below and we&apos;ll get back to you.</p>
                    </div>
                    <div className="space-y-5">
                        {[['Name', 'Sarah Lee'], ['Email', 'sarah@northwind.com'], ['Company', 'Northwind']].map(([label, value]) => (
                            <div key={label} className="w-full space-y-2">
                                <Label className="ml-1 text-sm font-medium text-foreground/80">{label}</Label>
                                <Input readOnly value={value} className="h-11 bg-background/50" />
                            </div>
                        ))}
                        <Button className="mt-6 h-11 w-full font-medium">Submit Request</Button>
                    </div>
                </Card>
            </Frame>
            <Frame className="p-4 sm:p-6">
                <div className="overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
                    <div className="flex items-center gap-2 border-b border-border bg-muted/40 p-4">
                        <Bell size={16} className="text-muted-foreground" />
                        <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">2 new</span>
                    </div>
                    <ul className="flex flex-col gap-1 p-2">
                        {notifications.map((n) => (
                            <li key={n.message} className={cn('flex items-start gap-3 rounded-lg border px-3 py-2.5', n.unread ? 'border-border bg-accent/60' : 'border-transparent')}>
                                {n.unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className={cn('truncate text-sm', n.unread ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground')}>{n.title}</span>
                                        <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
                                    </div>
                                    <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-muted-foreground">{n.message}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Frame>
        </div>
    )
}

// ---------- Proposals: builder with the real sidebar and real pricing/button/signature blocks ----------

const proposalBlocks: Block[] = [
    {
        id: 'mock-pricing', type: 'pricing',
        props: { currency: '$', items: [{ name: 'Brand strategy', qty: 1, price: 1500 }, { name: 'Visual identity', qty: 1, price: 2500 }, { name: 'Website design', qty: 1, price: 2500 }] },
        size: { width: 640, height: 250 }, position: { x: 24, y: 196 },
    },
    {
        id: 'mock-signature', type: 'signature',
        props: { label: 'Client signature', signedName: 'Sarah Lee', signedAt: '2026-10-03T10:00:00Z' },
        size: { width: 340, height: 150 }, position: { x: 24, y: 466 },
    },
    {
        id: 'mock-button', type: 'button',
        props: { label: 'Book a kickoff call', url: 'https://cal.com' },
        size: { width: 280, height: 150 }, position: { x: 384, y: 466 },
    },
]

export function ProposalMock() {
    return (
        <Frame width={1120} className="flex h-[700px] flex-col">
            <DndContext id="landing-proposal-mock">
                {/* Copy of the builder header (proposalBuilder.Client.tsx) */}
                <header className="flex w-full items-center justify-between border-b border-border bg-background/95 px-6 py-3">
                    <div>
                        <h1 className="text-xl font-bold uppercase tracking-tight text-foreground">Proposal Builder</h1>
                        <p className="text-xs font-medium tracking-wide text-muted-foreground">Drag blocks to canvas &bull; Reorder freely</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" className="gap-2"><Sparkles className="h-4 w-4" /> AI Draft</Button>
                        <Button size="sm" className="gap-2"><Save className="h-4 w-4" /> Save</Button>
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground"><LinkIcon size={14} /> Share Link</Button>
                    </div>
                </header>
                <div className="flex min-h-0 flex-1">
                    <aside className="w-[300px] shrink-0 border-r border-border bg-card">
                        <ProposalSidebar isCollapsed={false} setIsCollapsed={noop} sidebarDragableItems={ProposalBuilderBlocks} activeBlock={null} />
                    </aside>
                    <main className="flex-1 overflow-hidden bg-muted/40 p-8">
                        <div className="relative mx-auto h-[800px] max-w-[700px] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
                            {/* Text block: what Editor.js renders inside a borderless text block */}
                            <div className="absolute left-6 top-6 w-[640px] rounded-lg bg-white p-5 text-neutral-900">
                                <h2 className="text-2xl font-bold">Northwind rebrand</h2>
                                <p className="mt-3 leading-relaxed text-neutral-700">
                                    Northwind is preparing for a Q1 launch and needs a brand system that scales from the website to the product.
                                    This proposal covers strategy, identity and the new marketing site.
                                </p>
                            </div>
                            {proposalBlocks.map((block) => (
                                <BlockRenderer
                                    key={block.id}
                                    block={block}
                                    updateBlockProps={noop}
                                    updateBlockPosition={noop}
                                    updateBlockSize={noop}
                                    deleteBlock={noop}
                                    uploadImage={async () => ({ url: '' })}
                                />
                            ))}
                        </div>
                    </main>
                </div>
            </DndContext>
        </Frame>
    )
}

// ---------- Client portal: the client dashboard (client/dashboard.Client.tsx) ----------

export function PortalMock() {
    return (
        <Frame width={1120} className="flex h-[680px]">
            <ShellSidebarClient />
            <div className="flex min-w-0 flex-1 flex-col">
                <ShellHeader />
                <div className="space-y-6 px-8 py-8">
                    <PageHeader
                        title="Welcome back, Sarah"
                        description="Here's where your projects stand."
                        actions={
                            <div className="flex h-8 w-[240px] items-center justify-between rounded-md border border-input bg-transparent px-3 text-sm">
                                Northwind rebrand <span className="text-muted-foreground">⌄</span>
                            </div>
                        }
                    />
                    <ClientOnly fallback={<div className="h-[150px] rounded-xl border border-border bg-card" />}>
                        <SectionCards project={sampleProject} />
                    </ClientOnly>
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium">Design preview</h2>
                        <div className="flex aspect-[16/6] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40">
                            <div className="w-2/3 space-y-3">
                                <div className="h-3 w-1/4 rounded bg-foreground/15" />
                                <div className="h-20 rounded-lg bg-foreground/10" />
                                <div className="grid grid-cols-3 gap-3"><div className="h-10 rounded-md bg-foreground/10" /><div className="h-10 rounded-md bg-foreground/10" /><div className="h-10 rounded-md bg-foreground/10" /></div>
                                <p className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground"><Figma className="size-3.5" /> Homepage v2 · embedded from Figma</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Frame>
    )
}

function ShellSidebarClient() {
    // Clients see a shorter menu (ClientSidebarItems); same sidebar chrome
    return (
        <aside className="flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
            <div className="flex h-14 items-center px-4"><span className="text-base font-semibold tracking-tight">StudioFlow</span></div>
            <nav className="space-y-0.5 px-3 pt-5">
                <p className="px-2.5 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">Menu</p>
                {['Dashboard', 'Projects', 'Invoices'].map((label, i) => (
                    <div key={label} className={cn('relative flex h-9 items-center rounded-md px-2.5 text-sm text-muted-foreground', i === 0 && 'bg-background font-medium text-foreground shadow-xs ring-1 ring-sidebar-border before:absolute before:-left-3 before:h-5 before:w-0.5 before:rounded-r before:bg-primary')}>
                        {label}
                    </div>
                ))}
            </nav>
        </aside>
    )
}

// ---------- Invoices: the creator invoices page (creator/Invoices.tsx) ----------

const invoiceStatus = {
    PAID: { label: 'Paid', tone: TONES.emerald },
    SENT: { label: 'Pending', tone: TONES.amber },
    OVERDUE: { label: 'Overdue', tone: TONES.red },
    DRAFT: { label: 'Draft', tone: TONES.neutral },
}

const invoices: { num: string; client: string; email: string; project: string; due: string; amount: string; status: keyof typeof invoiceStatus }[] = [
    { num: 'INV-1042', client: 'Sarah Lee', email: 'sarah@northwind.com', project: 'Northwind rebrand', due: 'Oct 02, 2026', amount: '$3,200.00', status: 'PAID' },
    { num: 'INV-1043', client: 'Sarah Lee', email: 'sarah@northwind.com', project: 'Northwind rebrand', due: 'Oct 21, 2026', amount: '$3,300.00', status: 'SENT' },
    { num: 'INV-1039', client: 'Leo Park', email: 'leo@gmail.com', project: 'Portfolio site', due: 'Sep 30, 2026', amount: '$800.00', status: 'OVERDUE' },
    { num: 'INV-1044', client: 'Mia Chen', email: 'mia@hooli.com', project: 'Hooli app UI', due: 'Nov 04, 2026', amount: '$2,100.00', status: 'DRAFT' },
]

export function InvoiceMock() {
    return (
        <Frame width={1120} className="flex h-[640px]">
            <ShellSidebar active="Invoices" />
            <div className="flex min-w-0 flex-1 flex-col">
                <ShellHeader />
                <div className="px-8 py-8">
                    <PageHeader
                        title="Invoices"
                        description="4 invoices"
                        actions={<Button size="sm" className="gap-1.5"><Plus className="size-4" /> New invoice</Button>}
                    >
                        <Tabs value="ALL">
                            <TabsList variant="line" className="h-8">
                                <TabsTrigger value="ALL" className="flex-none px-2.5">All</TabsTrigger>
                                {Object.entries(invoiceStatus).map(([key, s]) => (
                                    <TabsTrigger key={key} value={key} className="flex-none px-2.5">{s.label}</TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input readOnly placeholder="Invoice number or amount..." className="h-8 pl-8" />
                        </div>
                    </PageHeader>
                    <div className="my-6 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-card">
                        {[['Total paid', '$3,200.00', null], ['Outstanding', '$6,200.00', null], ['Next due', 'Sep 30, 2026', 'Invoice #INV-1039']].map(([label, value, sub]) => (
                            <div key={label} className="p-4">
                                <p className="text-xs text-muted-foreground">{label}</p>
                                <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
                                {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
                            </div>
                        ))}
                    </div>
                    <div className="overflow-hidden rounded-xl border border-border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/40 hover:bg-muted/40">
                                    {['Invoice', 'Client', 'Project', 'Due Date', 'Amount', 'Status', ''].map((h) => (
                                        <TableHead key={h} className="h-9 text-xs font-medium text-muted-foreground">{h}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((inv) => (
                                    <TableRow key={inv.num}>
                                        <TableCell className="font-mono font-medium">{inv.num}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{inv.client}</div>
                                            <div className="text-xs text-muted-foreground">{inv.email}</div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{inv.project}</TableCell>
                                        <TableCell className="text-muted-foreground">{inv.due}</TableCell>
                                        <TableCell className="font-semibold">{inv.amount}</TableCell>
                                        <TableCell><StatusPill tone={invoiceStatus[inv.status].tone}>{invoiceStatus[inv.status].label}</StatusPill></TableCell>
                                        <TableCell className="text-right text-muted-foreground"><MoreHorizontal className="ml-auto size-4" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </Frame>
    )
}
