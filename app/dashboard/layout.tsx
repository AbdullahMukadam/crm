'use client';

import { useState } from 'react';
import type { NavItem } from '@/types/ui';
import { Sidebar, MobileSidebar } from '@/components/ui/sidebar';
import { LayoutDashboard, Users, Settings, Menu } from 'lucide-react';

// Define your navigation items here
const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/proposals', label: 'Proposals', icon: Users },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen w-full bg-white dark:bg-gray-950">
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

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

