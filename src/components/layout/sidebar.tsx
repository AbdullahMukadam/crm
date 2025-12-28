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
                    "hidden h-screen flex-col font-brcolage-grotesque border-r bg-background dark:border-gray-800 dark:bg-gray-900 md:flex transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                {/* Sidebar Header */}
                <div className={cn("flex h-16 items-center px-4 border-b", isCollapsed ? "justify-center" : "justify-between")}>
                    <Link href="/" className={cn("flex items-center gap-2 font-semibold", isCollapsed && "hidden")}>
                        <h1 className="text-white font-bold text-xl tracking-tight cursor-pointer">StudioFlow</h1>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        {isCollapsed ? <PanelRightClose className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
                    </Button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-2 p-4 overflow-y-auto scrollbar-hide">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 transition-all hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-50",
                                    isActive ? "bg-accent" : "",
                                    isCollapsed ? "justify-center" : ""
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                <span className={cn("text-sm transition-all duration-200", isCollapsed ? "hidden w-0" : "block")}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="mt-auto border-t border-zinc-800/50 p-4">
                    <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between gap-3")}>

                        {!isCollapsed && (
                            <div className="flex items-center gap-3 overflow-hidden">
                                <Avatar>
                                    <AvatarImage src={avatarUrl || ""} alt={username || ""} />
                                    <AvatarFallback>{username?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                               
                                <div className="flex flex-col min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-50">{username || "User"}</p>
                                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">{role?.toUpperCase() || "GUEST"}</p>
                                </div>
                            </div>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-8 h-8 -mr-2">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card border-border">
                                <DropdownMenuItem
                                    className="hover:bg-muted cursor-pointer"
                                    onClick={() => setIsEditProfileOpen(true)} // Open Dialog on click
                                >
                                    <CircleUser className="h-5 w-5 mr-2" /> My Account
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-muted cursor-pointer" onClick={handleLogout}>
                                    <LogOut className="h-5 w-5 mr-2" /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </div>
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
                    "fixed font-brcolage-grotesque inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r bg-background dark:border-gray-800 dark:bg-gray-900 transition-transform duration-300 ease-in-out md:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setIsOpen(false)}>
                        <span className="text-white font-bold text-xl tracking-tight cursor-pointer">StudioFlow</span>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 transition-all hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-50",
                                { "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-50": pathname === item.href }
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Footer (Fixed Layout) */}
                <div className='mt-auto p-4 border-t border-zinc-800/50'>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700">
                                <span className="font-semibold text-gray-600 dark:text-gray-300">
                                    {username?.charAt(0) || "U"}
                                </span>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <p className="truncate text-sm font-medium text-gray-50">{username || "User"}</p>
                                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{role?.toUpperCase() || "GUEST"}</p>
                            </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex shrink-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsEditProfileOpen(true)}
                                className="text-gray-400 hover:text-white"
                                title="Edit Profile"
                            >
                                <Settings className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-white"
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