"use client"
import React, { useEffect, useState } from 'react';
import { Bell, User, ChevronDown, ArrowUpRight, Search } from 'lucide-react';;
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import SearchComponent from './ui/search';
import { useSearch } from '@/hooks/useSearch';
import { NotificationsData } from '@/types/notifications';
import notificationService from '@/lib/api/notificarionService';

export const Header: React.FC = () => {
    const { isLoading, searchResults, handleSearch } = useSearch()
    const [notificationsData, setnotificationsData] = useState<NotificationsData | null>(null)

    useEffect(() => {
      const timerId = setInterval(async() => {
         await notificationService.fetchNotifications()
      },30000)

      return () => clearInterval(timerId)
    },[])
    
      const notifications = notificationsData?.notifications || [];
      const unreadCount = notificationsData?.unreadCount || 0;

    return (
        <header className="h-16 border-b border-border bg-[#0A0A0A] backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
            {/* Breadcrumb / Title */}
            <div className="text-lg font-mono text-gray-300">
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className='relative text-gray-400 hover:text-white transition-colors'>
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <NavigationMenuLink>Link</NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <SearchComponent
                    isLoading={isLoading}
                    searchResults={searchResults}
                    onSearch={handleSearch}
                     />
            </div>
        </header>
    );
};