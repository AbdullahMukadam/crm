"use client"
import { useAppSelector } from '@/lib/store/hooks'
import { inter } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from '../common/theme-toggle'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const scope = usePathname() === '/' ? inter.className : ''

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const commonItems = [
    { name: 'Intake', href: '/#intake' },
    { name: 'Proposals', href: '/#proposals' },
    { name: 'Client portal', href: '/#portal' },
    { name: 'Invoices', href: '/#invoices' },
  ]

  return (
    <>
      <header className={cn(
        isAuthenticated ? 'hidden' : 'fixed inset-x-0 top-0',
        'z-50 h-14 border-b border-border bg-background/80 text-foreground backdrop-blur-md',
        scope
      )}>
        <div className='mx-auto flex h-full max-w-6xl items-center justify-between px-6'>
          <div className='flex items-center gap-10'>
            <Link href="/" onClick={closeMenu} className='text-[15px] font-medium tracking-tight'>
              StudioFlow
            </Link>
            <nav className='hidden lg:flex items-center gap-7 text-[13px] text-muted-foreground'>
              {commonItems.map((item) => (
                <Link key={item.name} href={item.href} className='hover:text-foreground transition-colors duration-200'>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className='flex items-center gap-3'>
            <ThemeToggle />
            <Link href={"/signin"} className='hidden md:block text-[13px] text-muted-foreground hover:text-foreground transition-colors'>
              Log in
            </Link>
            <Link href={"/signup"} className='hidden md:inline-flex h-8 items-center rounded-full bg-foreground px-3.5 text-[13px] font-medium text-background hover:bg-foreground/90 transition-colors'>
              Sign up
            </Link>

          <button
            type="button"
            onClick={toggleMenu}
            className='lg:hidden cursor-pointer p-2 rounded-full hover:bg-muted transition-all duration-200 relative z-50'
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'
                }`} />
              <span className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'
                }`} />
              <span className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'
                }`} />
            </div>
          </button>
          </div>
        </div>
      </header>


      {isOpen && (
        <div className={cn("fixed inset-0 z-40 transition-all ease-in duration-75 lg:hidden", scope)}>
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
          />


          <div className={`mobile-menu absolute top-16 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm
                          bg-popover border border-border rounded-3xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.25)]
                          transition-all duration-300 ease-out ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
            }`}>
            <nav className="flex flex-col p-6 space-y-1 text-popover-foreground">
              {[...commonItems, { name: 'Log in', href: '/signin' }].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className="block px-4 py-3 hover:bg-muted rounded-lg transition-colors duration-200 font-medium"
                >
                  {item.name}
                </Link>
              ))}


              <div className="pt-4 flex items-center justify-center text-center">
                <Link
                  href={"/signup"}
                  className="w-full px-4 py-3 bg-foreground text-background font-medium rounded-full
                           hover:bg-foreground/90 transition-colors duration-200"
                >
                  Sign up
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
