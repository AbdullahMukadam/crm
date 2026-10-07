"use client"
import { useAppSelector } from '@/lib/store/hooks'
import { inter } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '../common/theme-toggle'

const navItems = [
  { name: 'Intake', href: '/#intake' },
  { name: 'Proposals', href: '/#proposals' },
  { name: 'Client portal', href: '/#portal' },
  { name: 'Invoices', href: '/#invoices' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const scope = usePathname() === '/' ? inter.className : ''
  const closeMenu = () => setIsOpen(false)

  // While the mobile menu is open: lock page scroll, close on Escape or when the desktop nav takes over
  useEffect(() => {
    if (!isOpen) return
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
    const onResize = () => desktop.matches && setIsOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
    }
  }, [isOpen])

  if (isAuthenticated) return null

  return (
    <>
      <header className={cn(
        'fixed inset-x-0 top-0 z-50 h-14 border-b border-border text-foreground',
        isOpen ? 'bg-background' : 'bg-background/80 backdrop-blur-md',
        scope
      )}>
        <div className='mx-auto flex h-full max-w-6xl items-center justify-between px-5 sm:px-6'>
          <div className='flex items-center gap-10'>
            <Link href="/" onClick={closeMenu} className='text-[15px] font-medium tracking-tight'>
              StudioFlow
            </Link>
            <nav className='hidden lg:flex items-center gap-7 text-[13px] text-muted-foreground'>
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} className='hover:text-foreground transition-colors duration-200'>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className='flex items-center gap-2 sm:gap-3'>
            <ThemeToggle />
            <Link href="/signin" className='hidden md:block text-[13px] text-muted-foreground hover:text-foreground transition-colors'>
              Log in
            </Link>
            <Link href="/signup" className='hidden md:inline-flex h-8 items-center rounded-full bg-foreground px-3.5 text-[13px] font-medium text-background hover:bg-foreground/90 transition-colors'>
              Sign up
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className='lg:hidden -mr-2 flex size-9 items-center justify-center rounded-full hover:bg-muted transition-colors'
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {/* Two lines that cross into an X */}
              <span className="relative block h-3 w-[18px]">
                <span className={cn('absolute left-0 h-px w-full bg-foreground transition-all duration-300', isOpen ? 'top-1.5 rotate-45' : 'top-0.5')} />
                <span className={cn('absolute left-0 h-px w-full bg-foreground transition-all duration-300', isOpen ? 'top-1.5 -rotate-45' : 'top-2.5')} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div
          id="mobile-menu"
          className={cn('fixed inset-x-0 bottom-0 top-14 z-40 flex flex-col overflow-y-auto bg-background px-5 pb-8 pt-2 text-foreground animate-in fade-in slide-in-from-top-1 duration-200 sm:px-6 lg:hidden', scope)}
        >
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className="border-b border-border py-4 text-[17px] font-medium tracking-tight transition-colors hover:text-muted-foreground"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="mt-auto grid gap-3 pt-8">
            <Link href="/signin" onClick={closeMenu} className="flex h-11 items-center justify-center rounded-full border border-border text-[15px] font-medium hover:bg-muted transition-colors">
              Log in
            </Link>
            <Link href="/signup" onClick={closeMenu} className="flex h-11 items-center justify-center rounded-full bg-foreground text-[15px] font-medium text-background hover:bg-foreground/90 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
