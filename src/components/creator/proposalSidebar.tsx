'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type NavItem } from '@/types/ui';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/lib/store/hooks';
import { LogoutUser } from '@/lib/store/features/authSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LogOut, PanelLeftClose, PanelRightClose } from 'lucide-react';


interface SidebarProps {
    navItems: NavItem[];
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

function ProposalSidebar({ navItems, isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();


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
                <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
                    <div className="h-9 w-9 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                        <span className="font-semibold text-gray-600 dark:text-gray-300">AM</span>
                    </div>
                    <div className={cn(isCollapsed && "hidden")}>
                        <p className="text-sm font-medium text-gray-50">Abdullah M.</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Creator</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className={cn(isCollapsed ? "flex" : "hidden", "ml-auto")}>
                        <LogOut className="h-5 w-5" />
                    </Button>
                    <Button onClick={handleLogout} variant="outline" size="sm" className={cn(isCollapsed && "hidden", "ml-auto")}>Logout</Button>
                </div>
            </div>
        </aside>
    );
}

export default ProposalSidebar;