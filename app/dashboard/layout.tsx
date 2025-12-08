'use client';

import { useEffect, useState } from 'react';
import { Sidebar, MobileSidebar } from '@/components/ui/sidebar';
import { CreatorSidebarItems } from '@/config/sidebarConfig';
import { useAppSelector } from '@/lib/store/hooks';
import { NavItem } from '@/types/ui';
import { Header } from '@/components/header';


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { role } = useAppSelector((state) => state.auth);
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
    const [sidebarItems, setsidebarItems] = useState<NavItem[]>([]);

    useEffect(() => {
        if (role === "admin") {
            setsidebarItems(CreatorSidebarItems)
        } else if (role === "creator") {
            setsidebarItems(CreatorSidebarItems)
        } else {
            setsidebarItems(CreatorSidebarItems)
        }
    }, [role])



    return (
        <div className="flex h-screen w-full">
            {/* Desktop Sidebar */}
            <Sidebar
                navItems={sidebarItems}
                isCollapsed={isDesktopSidebarCollapsed}
                setIsCollapsed={setIsDesktopSidebarCollapsed}
            />

            {/* Mobile Sidebar */}
            <MobileSidebar
                navItems={sidebarItems}
                isOpen={isMobileSidebarOpen}
                setIsOpen={setIsMobileSidebarOpen}
            />

            <div className="flex flex-1 flex-col">

                <label className='absolute top-2 left-2 md:hidden z-50' htmlFor="menu-toggle">
                    <div
                        className="w-9 h-10 cursor-pointer flex flex-col items-center justify-center bg-white rounded-full"
                        onClick={() => setIsMobileSidebarOpen(prev => !prev)}
                    >
                        <input className="hidden peer" type="checkbox" />
                        <div
                            className="w-[50%] h-[2px] bg-black rounded-sm transition-all duration-300 origin-left translate-y-[0.45rem] peer-checked:rotate-[-45deg]"
                        ></div>
                        <div
                            className="w-[50%] h-[2px] bg-black rounded-md transition-all duration-300 origin-center peer-checked:hidden"
                        ></div>
                        <div
                            className="w-[50%] h-[2px] bg-black rounded-md transition-all duration-300 origin-left -translate-y-[0.45rem] peer-checked:rotate-[45deg]"
                        ></div>
                    </div>
                </label>
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <Header />
                    {children}
                </main>
            </div>
        </div>
    );
}

