'use client';

import { useState } from 'react';
import type { NavItem } from '@/types/ui';
import { Sidebar, MobileSidebar } from '@/components/ui/sidebar';
import { LayoutDashboard, Users, Settings, Menu } from 'lucide-react';

// Define your navigation items here
const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, isActive: true },
    { href: '/dashboard/proposals', label: 'Proposals', icon: Users, isActive: false },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings, isActive: false },
];


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen w-full">
            {/* Desktop Sidebar */}
            <Sidebar
                navItems={navItems}
                isCollapsed={isDesktopSidebarCollapsed}
                setIsCollapsed={setIsDesktopSidebarCollapsed}
            />

            {/* Mobile Sidebar */}
            <MobileSidebar
                navItems={navItems}
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
                    {children}
                </main>
            </div>
        </div>
    );
}

