'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type NavItem } from '@/types/ui';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelRightClose } from 'lucide-react';
import { Block } from '@/types/proposal';
import DragableSidebarItem from './dragableSidebarItem';
import { useState } from 'react';


interface SidebarProps {
    sidebarDragableItems: Block[];
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

function ProposalSidebar({ sidebarDragableItems, isCollapsed, setIsCollapsed }: SidebarProps) {
    const [blocks, setblocks] = useState<Block[]>(sidebarDragableItems);

    return (
        <aside
            className={cn(
                "hidden h-screen flex-col font-brcolage-grotesque border-r bg-[#0A0A0A] dark:border-gray-800 dark:bg-gray-900 md:flex transition-all duration-300 ease-in-out",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Sidebar Header */}
            <div className="flex h-16 items-center border-b px-6 justify-between">
                <Link href="/" className={cn("flex items-center gap-2 font-semibold", isCollapsed && "justify-center")}>
                    <h1 className={`${isCollapsed ? "hidden" : "text-white font-bold text-xl tracking-tight cursor-pointer"}`}>StudioFlow</h1>
                </Link>
                <Button
                    variant="default"
                    size="icon"
                    className="hidden md:flex"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <PanelRightClose className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
                </Button>
            </div>

            <div className='pt-4 pl-4 space-x-2'>
                <h2 className='text-white text-2xl font-bold'>Blocks</h2>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2 p-4">
                {blocks.map((item) => {
                    return <DragableSidebarItem key={item.id} item={item} />
                })}
            </nav>
        </aside>
    );
}

export default ProposalSidebar;