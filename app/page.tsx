import Footer from '@/components/layout/footer'
import { DashboardMock, IntakeMock, InvoiceMock, PortalMock, ProposalMock } from '@/components/landing/mocks'
import { inter } from '@/lib/fonts'
import { ArrowRight, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const fg = 'text-foreground'
const muted = 'text-muted-foreground'
const rise = (delay: number) => ({ animationDelay: `${delay}ms` })
const fade = '[mask-image:linear-gradient(to_bottom,black_55%,transparent)]'

const svgProps = {
  viewBox: '0 0 240 160',
  className: 'h-full w-full overflow-visible',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const
// Hover motion for one SVG part; disabled for reduced motion
const motion = 'transition-[translate,rotate,scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-box:fill-box] origin-center motion-reduce:transition-none'
// Re-draws a stroke on hover (`draw` keyframe in globals.css); needs pathLength={1}
const redraw = '[stroke-dasharray:1] group-hover:animate-[draw_1.1s_ease-out] motion-reduce:group-hover:animate-none'

// Kanban board with a lead card being dragged into the next stage
function PipelineArt() {
  const cols = [
    { x: 20, cards: [26, 48, 70] },
    { x: 92, cards: [26] },
    { x: 164, cards: [26, 48] },
  ]
  return (
    <svg aria-hidden="true" {...svgProps}>
      {cols.map(({ x, cards }) => (
        <g key={x}>
          <rect x={x} y={14} width={56} height={128} rx={7} />
          <circle cx={x + 9} cy={24} r={1.8} />
          <line x1={x + 15} y1={24} x2={x + 34} y2={24} />
          {cards.map((y) => (
            <g key={y}>
              <rect x={x + 6} y={y + 6} width={44} height={18} rx={3} />
              <line x1={x + 12} y1={y + 15} x2={x + 32} y2={y + 15} opacity={0.6} />
            </g>
          ))}
        </g>
      ))}
      {/* Drop target in the next stage */}
      <rect x={98} y={54} width={44} height={18} rx={3} strokeDasharray="3 3" opacity={0.7} />
      {/* The lead being dragged */}
      <g className={`${motion} -rotate-6 group-hover:translate-x-[14px] group-hover:-translate-y-[14px] group-hover:-rotate-1`}>
        <rect x={64} y={84} width={44} height={18} rx={3} className="fill-background stroke-foreground" />
        <circle cx={71} cy={93} r={1.8} className="stroke-foreground" />
        <line x1={76} y1={93} x2={96} y2={93} className="stroke-foreground" />
      </g>
    </svg>
  )
}

// A proposal writing itself: text, pricing table, signature
function ProposalArt() {
  return (
    <svg aria-hidden="true" {...svgProps}>
      <rect x={60} y={10} width={120} height={140} rx={7} />
      <line x1={74} y1={28} x2={128} y2={28} className="stroke-foreground" />
      <line x1={74} y1={42} x2={166} y2={42} opacity={0.6} />
      <line x1={74} y1={50} x2={158} y2={50} opacity={0.6} />
      <line x1={74} y1={58} x2={134} y2={58} pathLength={1} opacity={0.6} className={redraw} />
      {/* Pricing table */}
      <rect x={74} y={70} width={92} height={42} rx={3} />
      <line x1={74} y1={84} x2={166} y2={84} opacity={0.4} />
      <line x1={74} y1={98} x2={166} y2={98} opacity={0.4} />
      <line x1={80} y1={77} x2={108} y2={77} opacity={0.6} />
      <line x1={146} y1={77} x2={160} y2={77} opacity={0.6} />
      <line x1={80} y1={91} x2={114} y2={91} opacity={0.6} />
      <line x1={146} y1={91} x2={160} y2={91} opacity={0.6} />
      <line x1={80} y1={105} x2={100} y2={105} className="stroke-foreground" />
      <line x1={142} y1={105} x2={160} y2={105} className="stroke-foreground" />
      {/* Signature */}
      <path d="M76 132 c4 -10 8 -10 9 -2 s4 6 7 -3 s5 -4 6 1 s4 2 8 -2" pathLength={1} className={redraw} />
      <line x1={74} y1={138} x2={122} y2={138} opacity={0.5} />
      {/* AI sparkle */}
      <path
        d="M178 6 C179 14 182 17 190 18 C182 19 179 22 178 30 C177 22 174 19 166 18 C174 17 177 14 178 6 Z"
        className={`${motion} fill-background stroke-foreground group-hover:rotate-45 group-hover:scale-110`}
      />
    </svg>
  )
}

// The client's single link: design preview, signature, paid invoice, feedback
function PortalArt() {
  return (
    <svg aria-hidden="true" {...svgProps}>
      <rect x={24} y={12} width={192} height={136} rx={8} />
      <line x1={24} y1={32} x2={216} y2={32} />
      {[36, 44, 52].map((cx) => <circle key={cx} cx={cx} cy={22} r={1.8} opacity={0.6} />)}
      {/* URL bar with link glyph (lucide "link", scaled) */}
      <rect x={70} y={17} width={112} height={10} rx={5} className="stroke-foreground" />
      <g transform="translate(75 18.2) scale(0.32)" className="stroke-foreground" strokeWidth={3}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </g>
      <line x1={88} y1={22} x2={132} y2={22} opacity={0.5} />
      {/* Design preview */}
      <rect x={38} y={44} width={96} height={58} rx={4} />
      <line x1={48} y1={56} x2={84} y2={56} opacity={0.6} />
      <rect x={48} y={64} width={76} height={18} rx={2} opacity={0.5} />
      <rect x={48} y={88} width={22} height={7} rx={1.5} opacity={0.5} />
      <rect x={75} y={88} width={22} height={7} rx={1.5} opacity={0.5} />
      <rect x={102} y={88} width={22} height={7} rx={1.5} opacity={0.5} />
      {/* Signature */}
      <path d="M150 62 c4 -10 8 -10 9 -2 s4 6 7 -3 s5 -4 6 1 s4 2 8 -2" pathLength={1} className={`stroke-foreground ${redraw}`} />
      <line x1={148} y1={68} x2={202} y2={68} opacity={0.5} />
      {/* Paid invoice */}
      <rect x={148} y={80} width={54} height={22} rx={3} />
      <line x1={155} y1={91} x2={176} y2={91} opacity={0.6} />
      <circle cx={192} cy={91} r={5} className="stroke-foreground" />
      <path d="M189.6 91 l1.7 1.7 l3.2 -3.4" className="stroke-foreground" />
      {/* Feedback bubble */}
      <path d="M38 116 h98 a4 4 0 0 1 4 4 v12 a4 4 0 0 1 -4 4 h-86 l-8 6 v-6 h-4 a4 4 0 0 1 -4 -4 v-12 a4 4 0 0 1 4 -4 z" />
      <line x1={48} y1={124} x2={112} y2={124} opacity={0.6} />
      <line x1={48} y1={130} x2={92} y2={130} opacity={0.6} />
    </svg>
  )
}

const pillars = [
  { art: PipelineArt, title: 'Built for client work', body: 'Shaped around how freelancers actually win, run and bill projects.' },
  { art: ProposalArt, title: 'Drafted with AI', body: 'Turn a short brief into a full proposal you can edit, price and send.' },
  { art: PortalArt, title: 'One link for clients', body: 'Clients read, sign, review designs and see invoices without chasing email.' },
]

const chapters = [
  {
    id: 'intake',
    title: ['Intake', 'and pipeline'],
    body: 'Share your own lead form. Every enquiry becomes a card in your pipeline, with a live notification the moment it arrives.',
    mock: <IntakeMock />,
    subs: ['Custom lead form', 'Kanban pipeline', 'Live notifications'],
  },
  {
    id: 'proposals',
    title: ['Proposals', 'and signatures'],
    body: 'Start from an AI draft or a blank canvas. Drag in text, images, pricing tables and a signature block, then share one link.',
    mock: <ProposalMock />,
    subs: ['AI drafts', 'Pricing tables', 'E-signatures'],
  },
  {
    id: 'portal',
    title: ['Projects', 'and client portal'],
    body: 'An accepted proposal becomes a project automatically. Clients follow progress, preview your Figma file and leave feedback.',
    mock: <PortalMock />,
    subs: ['Automatic projects', 'Figma previews', 'Feedback threads'],
  },
  {
    id: 'invoices',
    title: ['Invoices', 'and tracking'],
    body: 'Bill against a project, download clean PDFs, and see what’s paid, pending or overdue at a glance.',
    mock: <InvoiceMock />,
    subs: ['Per-project billing', 'PDF download', 'Status tracking'],
  },
]

// ponytail: hand-maintained; move to a data file or CMS if it grows
const changelog = [
  { date: '2026-10-07', title: 'Light and dark mode', body: 'Switch themes from the top bar. Every page, sign-in included, follows your choice.' },
  { date: '2026-10-06', title: 'Redesigned workspace', body: 'A calmer pipeline, cleaner projects and invoices, and a new sidebar.' },
  { date: '2026-10-05', title: 'New proposal blocks', body: 'Pricing tables, call-to-action buttons and client signatures.' },
  { date: '2026-10-04', title: 'AI proposal drafts', body: 'Describe the project and get a complete, editable proposal on the canvas.' },
]

export default function LandingPage() {
  return (
    <div className={`${inter.className} min-h-screen bg-background ${fg} antialiased`}>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-36 sm:pt-44">
        <h1 style={rise(0)} className="rise max-w-3xl text-balance text-[40px] font-medium leading-[1.05] tracking-[-0.025em] sm:text-[56px] lg:text-[64px]">
          The business system for freelance designers and studios
        </h1>
        <div style={rise(100)} className="rise mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className={`max-w-md text-pretty text-[15px] leading-relaxed ${muted}`}>
            Purpose-built for client work. Leads, proposals, projects and invoices in one place.
          </p>
          <Link href="#proposals" className={`group inline-flex items-center gap-1 text-[13px] ${muted} hover:text-foreground`}>
            <span className={fg}>New:</span> AI proposal drafts
            <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div style={rise(200)} className={`rise mt-16 ${fade}`}>
          <DashboardMock />
        </div>
      </section>

      {/* Statement + pillars */}
      <section className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
        <p className="max-w-4xl text-pretty text-[28px] font-medium leading-[1.2] tracking-[-0.02em] sm:text-[40px]">
          A new kind of studio tool.{' '}
          <span className={muted}>
            StudioFlow replaces the form builder, the doc editor, the shared file links and the invoicing spreadsheet
            with one system built around your clients.
          </span>
        </p>
        <div className="mt-20 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {pillars.map(({ art: Art, title, body }) => (
            <div key={title} className="group">
              <div className="h-40 text-muted-foreground/70 transition-colors duration-500 group-hover:text-muted-foreground"><Art /></div>
              <h3 className="mt-8 text-[15px] font-medium">{title}</h3>
              <p className={`mt-1.5 text-pretty text-[15px] leading-relaxed ${muted}`}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature chapters */}
      {chapters.map((ch) => (
        <section key={ch.id} id={ch.id} className="scroll-mt-20 border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
            <div className="grid gap-6 md:grid-cols-2">
              <h2 className="text-[32px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[44px]">
                {ch.title[0]}
                <br />
                {ch.title[1]}
              </h2>
              <div className="md:pt-2">
                <p className={`max-w-md text-pretty text-[15px] leading-relaxed ${muted}`}>{ch.body}</p>
                <Link href="/signup" className={`group mt-4 inline-flex items-center gap-1 text-[13px] ${fg}`}>
                  Get started <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
            <div className={`mt-16 ${fade}`}>{ch.mock}</div>
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-5 text-[13px]">
              {ch.subs.map((s) => <p key={s} className={muted}>{s}</p>)}
            </div>
          </div>
        </section>
      ))}

      {/* Changelog */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <h2 className="text-[32px] font-medium tracking-[-0.02em] sm:text-[44px]">Changelog</h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {changelog.map((entry) => (
              <article key={entry.title} className="bg-background p-6">
                <span className="block size-1.5 rounded-full bg-foreground" />
                <p className="mt-6 text-[15px] font-medium">{entry.title}</p>
                <p className={`mt-1.5 text-[13px] leading-relaxed ${muted}`}>{entry.body}</p>
                <time dateTime={entry.date} className={`mt-6 block text-[12px] ${muted}`}>
                  {new Date(`${entry.date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                </time>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-32 text-center sm:py-44">
          <h2 className="text-[40px] font-medium leading-[1.05] tracking-[-0.025em] sm:text-[56px] lg:text-[64px]">
            Built for client work.
            <br />
            Available today.
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground px-5 text-[14px] font-medium text-background transition-colors hover:bg-foreground/90">
              Get started <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/signin" className="inline-flex h-10 items-center rounded-full border border-border bg-muted/40 px-5 text-[14px] font-medium transition-colors hover:bg-muted">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
