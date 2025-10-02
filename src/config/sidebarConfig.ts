import { NavItem } from "@/types/ui";
import { LayoutDashboard, Settings, Users } from "lucide-react";



export const CreatorSidebarItems: NavItem[] = [
    { href: '/dashboard/creator', label: 'Dashboard', icon: LayoutDashboard},
    { href: '/dashboard/creator/proposals', label: 'Proposals', icon: Users },
    { href: '/dashboard/creator/settings', label: 'Settings', icon: Settings},
]