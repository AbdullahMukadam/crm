import Link from 'next/link'

const columns = [
    {
        title: 'Product',
        links: [
            { label: 'Intake', href: '/#intake' },
            { label: 'Proposals', href: '/#proposals' },
            { label: 'Client portal', href: '/#portal' },
            { label: 'Invoices', href: '/#invoices' },
        ],
    },
    {
        title: 'Account',
        links: [
            { label: 'Sign up', href: '/signup' },
            { label: 'Sign in', href: '/signin' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'GitHub', href: 'https://github.com/AbdullahMukadam' },
            { label: 'X', href: 'https://x.com/abd_mukadam' },
        ],
    },
]

function Footer() {
    return (
        <footer className="border-t border-border bg-background text-[13px]">
            {/* Phones: logo on its own row, link columns in a 2-up grid */}
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-12 sm:grid-cols-[2fr_repeat(3,1fr)] sm:px-6 sm:py-16">
                <p className="col-span-2 text-[15px] font-medium text-foreground sm:col-span-1">StudioFlow</p>
                {columns.map((col) => (
                    <div key={col.title}>
                        <p className="font-medium text-foreground">{col.title}</p>
                        <ul className="mt-4 space-y-3 text-muted-foreground">
                            {col.links.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="transition-colors hover:text-foreground">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mx-auto max-w-6xl px-5 pb-10 text-muted-foreground sm:px-6">
                &copy; {new Date().getFullYear()} StudioFlow
            </div>
        </footer>
    )
}

export default Footer
