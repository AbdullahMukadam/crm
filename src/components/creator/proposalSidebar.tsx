'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelRightClose, GripVertical, Box } from 'lucide-react'; // Added icons
import { Block } from '@/types/proposal';
import DragableSidebarItem from './dragableSidebarItem';
import { DragOverlay } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area'; // Optional: If you have shadcn ScrollArea, otherwise use div

interface SidebarProps {
    sidebarDragableItems: Block[];
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
    activeBlock: Block | null;
}

function ProposalSidebar({ 
    sidebarDragableItems, 
    isCollapsed, 
    setIsCollapsed, 
    activeBlock 
}: SidebarProps) {

    return (
        <aside
            className={cn(
                "flex flex-col h-full bg-zinc-900 border-r border-zinc-800 transition-all duration-300 ease-in-out",
                // Width is controlled by parent on desktop, but we handle internal spacing here
                "w-full" 
            )}
        >
            {/* Sidebar Header */}
            <div className={cn(
                "flex h-14 items-center border-b border-zinc-800 px-4 shrink-0",
                isCollapsed ? "justify-center" : "justify-between"
            )}>
                {!isCollapsed && (
                    <div className="flex items-center gap-2 font-semibold text-white">
                       
                        <span className="tracking-tight">StudioFlow</span>
                    </div>
                )}

                {/* Collapse Toggle - Hidden on mobile (since mobile uses a drawer) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <PanelRightClose size={18} /> : <PanelLeftClose size={18} />}
                </Button>
            </div>

            {/* Section Header */}
            <div className={cn(
                "py-4 shrink-0", 
                isCollapsed ? "px-2 text-center" : "px-4"
            )}>
                {isCollapsed ? (
                    <div className="w-full h-px bg-zinc-800 my-2" />
                ) : (
                    <h2 className='text-zinc-400 text-xs font-bold uppercase tracking-wider'>
                        Blocks Library
                    </h2>
                )}
            </div>

            {/* Navigation Links / Draggable Items */}
            {/* Using flex-1 and overflow-y-auto ensures this section scrolls while header stays fixed */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 custom-scrollbar">
                <nav className="space-y-2">
                    {sidebarDragableItems?.map((item) => (
                        <DragableSidebarItem 
                            key={item.id} 
                            item={item} 
                            // You might need to pass isCollapsed to the item to hide text there too
                            // isCollapsed={isCollapsed} 
                        />
                    ))}
                    
                    {sidebarDragableItems.length === 0 && (
                        <div className="text-center py-10 text-zinc-600 text-sm">
                            No blocks found.
                        </div>
                    )}
                </nav>
            </div>

            {/* Drag Overlay - Visual feedback when dragging */}
            <DragOverlay dropAnimation={{
                duration: 250,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}>
                {activeBlock ? (
                    <div className="cursor-grabbing w-[200px] flex items-center gap-3 bg-zinc-800 text-zinc-100 p-3 rounded-xl shadow-2xl ring-2 ring-emerald-500/50 border border-zinc-700 opacity-90 scale-105">
                        <div className="p-2 bg-zinc-900 rounded-md border border-zinc-700">
                             {/* Try to render the specific icon for the block type here if available */}
                            <Box size={16} className="text-emerald-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm">{activeBlock.type}</span>
                            <span className="text-[10px] text-zinc-400">Drop to add</span>
                        </div>
                        <GripVertical className="ml-auto text-zinc-600" size={16} />
                    </div>
                ) : null}
            </DragOverlay>
        </aside>
    );
}

export default ProposalSidebar;