'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type NavItem } from '@/types/ui';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { LogoutUser } from '@/lib/store/features/authSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CircleUser, LogOut, MoreVertical, PanelLeftClose, PanelRightClose, Settings } from 'lucide-react';
import { removeProposals } from '@/lib/store/features/proposalsSlice';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditProfileDialog } from "@/components/common/edit-profile"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface SidebarProps {
    navItems: NavItem[];
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

export function Sidebar({ navItems, isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();

    // Assuming auth state might have email too, otherwise just pass username
    const { username, role, email, avatarUrl, id } = useAppSelector((state) => state.auth);

    // State for the dialog
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const response = await dispatch(LogoutUser());
            if (LogoutUser.fulfilled.match(response)) {
                toast.success("Logged out successfully");
                dispatch(removeProposals());
                router.push("/signin");
            } else {
                toast.error("Logout failed. Please try again.");
            }
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Logout failed. Please try again.');
        }
    };

    return (
        <>
            {/* Render the Dialog outside the visual layout */}
            <EditProfileDialog
                open={isEditProfileOpen}
                onOpenChange={setIsEditProfileOpen}
                initialData={{ username: username || '', email: email || '', avatarUrl: avatarUrl || "", userId: id || "" }}
            />

            <aside
                className={cn(
                    "hidden h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-[72px]" : "w-64"
                )}
            >
                {/* Sidebar Header */}
                <div className={cn("flex h-14 items-center px-3", isCollapsed ? "justify-center" : "justify-between pl-4")}>
                    <Link href="/" className={cn("text-base font-semibold tracking-tight text-foreground", isCollapsed && "hidden")}>
                        StudioFlow
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <PanelRightClose className="size-4" /> : <PanelLeftClose className="size-4" />}
                    </Button>
                </div>

                {/* Account card */}
                <div className="px-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className={cn(
                                    "flex w-full items-center gap-2.5 rounded-lg border border-sidebar-border bg-background/40 p-2 text-left transition-colors hover:bg-background/70",
                                    isCollapsed && "justify-center border-transparent bg-transparent p-1"
                                )}
                            >
                                <Avatar className="size-8">
                                    <AvatarImage src={avatarUrl ? avatarUrl : "/auth-image.jpg"} alt={username || ""} />
                                    <AvatarFallback>{username?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                {!isCollapsed && (
                                    <>
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <p className="truncate text-sm font-medium text-foreground">{username || "User"}</p>
                                            <p className="truncate text-xs text-muted-foreground">{email || role?.toLowerCase() || "guest"}</p>
                                        </div>
                                        <MoreVertical className="size-4 shrink-0 text-muted-foreground" />
                                    </>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => setIsEditProfileOpen(true)}>
                                <CircleUser className="size-4" /> My Account
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                                <LogOut className="size-4" /> Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-3 pt-5 scrollbar-hide">
                    {!isCollapsed && (
                        <p className="px-2.5 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">Menu</p>
                    )}
                    <div className="space-y-0.5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-background/50 hover:text-foreground",
                                        isActive && "bg-background font-medium text-foreground shadow-xs ring-1 ring-sidebar-border before:absolute before:-left-3 before:h-5 before:w-0.5 before:rounded-r before:bg-primary",
                                        isCollapsed && "justify-center px-0"
                                    )}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <item.icon className="size-4 shrink-0" />
                                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </aside>
        </>
    );
}

// MobileSidebar 
export function MobileSidebar({ navItems, isOpen, setIsOpen }: { navItems: NavItem[], isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { username, role, email, avatarUrl, id } = useAppSelector((state) => state.auth);

    // Separate state for mobile dialog
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const response = await dispatch(LogoutUser());
            if (LogoutUser.fulfilled.match(response)) {
                toast.success("Logged out successfully");
                router.push("/signin");
            } else {
                toast.error("Logout failed.");
            }
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Logout failed.');
        }
    };

    return (
        <>
            {/* Edit Profile Dialog */}
            <EditProfileDialog
                open={isEditProfileOpen}
                onOpenChange={setIsEditProfileOpen}
                initialData={{ username: username || '', email: email || '', avatarUrl: avatarUrl || "", userId: id || "" }}
            />

            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out md:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex h-14 items-center border-b border-sidebar-border px-4">
                    <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setIsOpen(false)}>
                        <span className="text-base font-semibold tracking-tight text-foreground">StudioFlow</span>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-0.5 p-3 overflow-y-auto bg-sidebar">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-background/50 hover:text-foreground",
                                pathname === item.href && "bg-background font-medium text-foreground shadow-xs ring-1 ring-sidebar-border"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Footer (Fixed Layout) */}
                <div className='mt-auto p-4 border-t border-sidebar-border'>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <Avatar>
                                <AvatarImage src={avatarUrl ? avatarUrl : "/auth-image.jpg"} alt={username || ""} />
                                <AvatarFallback>{username?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                                <p className="truncate text-sm font-medium text-foreground">{username || "User"}</p>
                                <p className="truncate text-xs text-muted-foreground">{role?.toUpperCase() || "GUEST"}</p>
                            </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex shrink-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsEditProfileOpen(true)}
                                className="text-muted-foreground hover:text-foreground"
                                title="Edit Profile"
                            >
                                <Settings className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="text-muted-foreground hover:text-foreground"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}