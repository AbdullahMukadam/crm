import { Github, Twitter } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Footer() {
    return (
        <footer className='w-full p-6 border-t border-gray-700 flex flex-col items-center justify-center bg-background font-brcolage-grotesque text-white'>
            <div className='w-full lg:w-[70%] lg:flex items-center justify-between'>
                <section className='w-full md:w-[40%] flex flex-col gap-2'>
                    <h2 className='text-2xl text-white font-bold font-brcolage-grotesque'>StudioFlow</h2>
                    <p className='text-gray-400 text-sm font-brcolage-grotesque'>The all-in-one suite for freelance developers and designers to win clients, manage projects, and get paid. No more scattered tools.</p>
                    <div className='w-full flex gap-2 mt-2 '>
                        <Link href={"/"}><Github size={20} className='text-gray-400 hover:text-white' /></Link>
                        <Link href={"/"}><Twitter size={20} className='text-gray-400 hover:text-white' /></Link>
                    </div>
                </section>
                <section className='w-full md:w-[40%] flex gap-2 mt-8 lg:mt-0'>
                    <div className='w-[40%] flex flex-col gap-2'>
                        <h2 className='font-bold'>Resources</h2>
                        <div className='w-full flex flex-col gap-[2px] text-gray-400 '>
                            <Link className='text-gray-400 hover:text-white' href={"/"}>Resources</Link>
                            <Link className='text-gray-400 hover:text-white' href={"/"}>Privacy Policy</Link>
                            <Link className='text-gray-400 hover:text-white' href={"/"}>Terms of use</Link>
                        </div>
                    </div>
                    <div className='w-1/2 flex flex-col justify-start gap-2'>
                        <h2 className='font-bold'>Company</h2>
                        <div className='w-full flex flex-col gap-[2px] text-gray-400'>
                            <Link className='text-gray-400 hover:text-white' href={"/"}>Contributors</Link>
                            <Link className='text-gray-400 hover:text-white' href={"/"}>About</Link>
                        </div>
                    </div>
                </section>
            </div>
            <div className='w-full lg:w-[70%]'>
                <section className='w-full mt-8'>
                    <p className='text-gray-400'>&#169; 2025 StudioFlow All Rights Reserved</p>
                </section>
            </div>
        </footer>
    )
}

export default Footer