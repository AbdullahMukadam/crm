import { NavItem } from "@/types/ui";
import { CreditCard, FolderOpenDot, LayoutDashboard, Settings, Users } from "lucide-react";


export const ClientSidebarItems: NavItem[] = [
    { href: '/dashboard/client', label: 'Dashboard', icon: LayoutDashboard},
    { href: '/dashboard/client/projects', label: 'Projects', icon: FolderOpenDot },
    { href: '/dashboard/client/invoices', label: 'Invoices', icon: CreditCard},
]


export const CreatorSidebarItems: NavItem[] = [
    { href: '/dashboard/creator', label: 'Dashboard', icon: LayoutDashboard},
    { href: '/dashboard/creator/proposals', label: 'Proposals', icon: Users },
    { href: '/dashboard/creator/projects', label: 'Projects', icon: FolderOpenDot},
    { href: '/dashboard/creator/invoices', label: 'Invoices', icon: CreditCard},
    { href: '/dashboard/creator/settings', label: 'Settings', icon: Settings},
]