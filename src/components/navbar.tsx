"use client"
import { useAppSelector } from '@/lib/store/hooks'
import Link from 'next/link'
import React, { useState } from 'react'
import { Header } from './header'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated } = useAppSelector((state) => state.auth)


  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)



  const commonItems = [
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
  ]

  return (
    <>
      <header className={`${isAuthenticated ? "hidden" : "fixed top-6"} left-1/2 transform -translate-x-1/2 w-[90%] max-w-6xl font-brcolage-grotesque px-4 p-2 z-50
                     bg-zinc-900 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg shadow-black/10
                     flex items-center justify-between transition-all duration-300`}>
        <section className='flex items-center'>
          <Link href="/" onClick={closeMenu}>
            <h1 className='text-white font-bold text-xl tracking-tight cursor-pointer'>StudioFlow</h1>
          </Link>
        </section>

        <section className='flex items-center gap-8 text-white/90'>
          <nav className='hidden md:flex items-center gap-6'>
            {commonItems.map((item) => (
              <Link key={item.name} href={item.href} className='hover:text-white transition-colors duration-200 font-medium'>
                {item.name}
              </Link>
            ))}
          </nav>

          <Link href={"/signup"} className='px-5 py-[7px] hidden md:block rounded-md bg-white/90 hover:bg-white text-black font-semibold 
                           transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg'>
            Get Started
          </Link>


          <button
            onClick={toggleMenu}
            className='md:hidden cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all duration-200 relative z-50'
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'
                }`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'
                }`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'
                }`} />
            </div>
          </button>
        </section>
      </header>


      {isOpen && (
        <div className="fixed inset-0 z-40 transition-all ease-in duration-75 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
          />


          <div className={`mobile-menu absolute top-20 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm
                          bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl
                          transition-all duration-300 ease-out ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
            }`}>
            <nav className="flex flex-col p-6 space-y-1 text-white/90">
              {commonItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className="block px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
                >
                  {item.name}
                </Link>
              ))}


              <div className="pt-4 flex items-center justify-center text-center">
                <Link
                  href={"/signup"}
                  className="w-full px-4 py-3 bg-black text-white font-semibold rounded-lg
                           hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started
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