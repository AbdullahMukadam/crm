'use client';

import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelRightClose, GripVertical, Blocks } from 'lucide-react'; // Added icons
import { Block } from '@/types/proposal';
import DragableSidebarItem from './dragableSidebarItem';
import { DragOverlay } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { getBlockIcon } from './blockIcons';

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
                "flex flex-col h-full bg-card border-r border-border transition-all duration-300 ease-in-out",
                // Width is controlled by parent on desktop, but we handle internal spacing here
                "w-full"
            )}
        >
            {/* Sidebar Header */}
            <div className={cn(
                "flex h-14 items-center border-b border-border px-4 shrink-0",
                isCollapsed ? "justify-center" : "justify-between"
            )}>
                {!isCollapsed && (
                    <div className="flex items-center gap-2.5 font-semibold text-foreground">
                        <span className="flex items-center justify-center size-7 rounded-md bg-primary/15 text-primary border border-primary/20">
                            <Blocks className="h-4 w-4" />
                        </span>
                        <span className="tracking-tight">StudioFlow</span>
                    </div>
                )}

                {/* Collapse Toggle - Hidden on mobile (since mobile uses a drawer) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted",
                        isCollapsed && "mx-auto"
                    )}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? <PanelRightClose size={18} /> : <PanelLeftClose size={18} />}
                </Button>
            </div>

            {/* Section Header */}
            <div className={cn(
                "py-3.5 shrink-0",
                isCollapsed ? "px-2 text-center" : "px-4"
            )}>
                {isCollapsed ? (
                    <div className="w-full h-px bg-border" />
                ) : (
                    <div className="flex items-center justify-between">
                        <h2 className='text-muted-foreground text-xs font-bold uppercase tracking-wider'>
                            Blocks Library
                        </h2>
                        <span className="text-[10px] font-semibold text-muted-foreground bg-muted/60 border border-border rounded-full px-2 py-0.5">
                            {sidebarDragableItems.length}
                        </span>
                    </div>
                )}
            </div>

            {/* Navigation Links / Draggable Items */}
            {/* Using flex-1 and overflow-y-auto ensures this section scrolls while header stays fixed */}
            <div className={cn("flex-1 overflow-y-auto pb-4 custom-scrollbar", isCollapsed ? "px-2" : "px-3")}>
                <nav className="space-y-1.5">
                    {sidebarDragableItems?.map((item) => (
                        <DragableSidebarItem
                            key={item.id}
                            item={item}
                            isCollapsed={isCollapsed}
                        />
                    ))}

                    {sidebarDragableItems.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground text-sm">
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
                    <div className="cursor-grabbing w-[220px] flex items-center gap-3 bg-card text-foreground p-3 rounded-xl shadow-2xl ring-2 ring-primary/50 border border-border opacity-95 scale-105">
                        <span className="flex items-center justify-center size-9 bg-primary/15 text-primary rounded-md border border-primary/20">
                            {getBlockIcon(activeBlock.type)}
                        </span>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm capitalize">{activeBlock.type}</span>
                            <span className="text-[10px] text-muted-foreground">Drop to add</span>
                        </div>
                        <GripVertical className="ml-auto text-muted-foreground/60" size={16} />
                    </div>
                ) : null}
            </DragOverlay>
        </aside>
    );
}

export default ProposalSidebar;