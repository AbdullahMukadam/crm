'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type NavItem } from '@/types/ui';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { LogoutUser } from '@/lib/store/features/authSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LogOut, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { removeProposals } from '@/lib/store/features/proposalsSlice';


interface SidebarProps {
    navItems: NavItem[];
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

export function Sidebar({ navItems, isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {username, role} = useAppSelector((state) => state.auth)


    const handleLogout = async () => {
        try {
            const response = await dispatch(LogoutUser());
            if (LogoutUser.fulfilled.match(response)) {
                toast.success("Logged out successfully");
                dispatch(removeProposals());
                router.push("/signin");
            } else if (LogoutUser.rejected.match(response)) {
                toast.error((response.payload as string) || "Logout failed. Please try again.");
            }
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error((error as any).toString() || 'Logout failed. Please try again.');
        }
    };

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

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2 p-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={
                                `flex items-center gap-3 ${isActive ? "bg-zinc-800" : ""} rounded-lg px-3 py-2 text-gray-200 transition-all hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-50`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className={cn("text-sm", isCollapsed && "hidden")}>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Sidebar Footer */}
            <div className="mt-auto p-4">
                <div className={cn("flex items-center gap-3")}>
                    <div className={cn("h-9 w-9 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center",isCollapsed && "hidden")}>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">{username?.charAt(0)}</span>
                    </div>
                    <div className={cn(isCollapsed && "hidden")}>
                        <p className="text-sm font-medium text-gray-50">{username || ""}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{role?.toUpperCase() || ""}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className={cn(isCollapsed ? "flex" : "hidden", "ml-auto text-black bg-white")}>
                        <LogOut className="h-5 w-5" />
                    </Button>
                    <Button onClick={handleLogout} variant="outline" size="sm" className={cn(isCollapsed && "hidden", "ml-auto")}>Logout</Button>
                </div>
            </div>
        </aside>
    );
}

// MobileSidebar 
export function MobileSidebar({ navItems, isOpen, setIsOpen }: { navItems: NavItem[], isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {username, role} = useAppSelector((state) => state.auth)

    const handleLogout = async () => {
        try {
            const response = await dispatch(LogoutUser());
            if (LogoutUser.fulfilled.match(response)) {
                toast.success("Logged out successfully");
                router.push("/signin");
            } else if (LogoutUser.rejected.match(response)) {
                toast.error((response.payload as string) || "Logout failed. Please try again.");
            }
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error((error as any).toString() || 'Logout failed. Please try again.');
        }
    };
    return (
        <>
            {isOpen && <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)} />}
            <aside className={cn("fixed font-brcolage-grotesque inset-y-0 left-0 z-40 h-full w-64 flex-col border-r bg-[#0A0A0A] dark:border-gray-800 dark:bg-gray-900 transition-transform duration-300 ease-in-out md:hidden", isOpen ? "translate-x-0" : "-translate-x-full")}>
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setIsOpen(false)}>
                        <span className="text-white font-bold text-xl tracking-tight cursor-pointer">StudioFlow</span>
                    </Link>
                </div>
                <nav className="flex-1 space-y-2 p-4">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 transition-all hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-50", { "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-50": pathname === item.href })}>
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className='mt-auto absolute bottom-0 p-4'>
                    <div className={"flex items-center gap-3"}>
                        <div>
                            <p className="text-sm font-medium text-gray-50">{username || ""}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{role?.toUpperCase() || ""}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleLogout} className={"flex ml-auto"}>
                            <LogOut className="h-5 w-5" />
                        </Button>
                        <Button onClick={handleLogout} variant="outline" size="sm" className={"ml-auto"}>Logout</Button>
                    </div>

                </div>
            </aside >
        </>
    );
}

