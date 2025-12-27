"use client"
import React, { useCallback, useEffect, useState } from 'react';
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
import Link from 'next/link';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useAppSelector } from '@/lib/store/hooks';

function ListItem({
    title,
    children,
    href,
    isRead = false,
    onMarkasRead,
    notificationId,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string; isRead?: boolean, onMarkasRead: (notificationId: string) => void, notificationId: string }) {
    
    const itemClassName = `relative p-3 sm:p-4 rounded-lg transition-colors duration-200 
                           ${isRead ? 'bg-zinc-800' : 'bg-zinc-800 border border-red-900/50'}`;

    const titleClassName = `text-sm font-semibold leading-none ${isRead ? 'text-gray-200' : 'text-white'}`;
    const messageClassName = `line-clamp-2 text-xs sm:text-sm leading-snug mt-1 ${isRead ? 'text-gray-500' : 'text-gray-400'}`;
    
    return (
        <li className={itemClassName} {...props}>
            <NavigationMenuLink asChild className='hover:bg-transparent'>
                <div className="block w-full">

                    {/* Unread indicator */}
                    {!isRead && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-600 rounded-r-sm" aria-hidden="true"></span>
                    )}

                    <div className={titleClassName}>{title}</div>
                    <p className={messageClassName}>{children}</p>

                    <div className="flex justify-end mt-2">
                        <Button 
                            variant={"outline"} 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={(e) => {
                                e.preventDefault(); // Prevent navigation when clicking mark as read
                                onMarkasRead(notificationId);
                            }}
                        >
                            Mark as Read
                        </Button>
                    </div>
                </div>
            </NavigationMenuLink>
        </li>
    )
}

export const Header: React.FC = () => {
    const { isLoading, searchResults, handleSearch } = useSearch()
    const [notificationsData, setnotificationsData] = useState<NotificationsData | null>(null)
    const { role } = useAppSelector((state) => state.auth)

    const handleFetchNotifications = useCallback(async () => {
        try {
            const response = await notificationService.fetchNotifications()
            if (response.success && response.data) {
                setnotificationsData(response.data)
            }
        } catch (error) {
            console.log("failed to load notifications")
        }
    }, [])

    const handleMarkasRead = useCallback(async (notificationId: string) => {
        try {
            const response = await notificationService.markasRead(notificationId)
            if (response.success) {
                toast.success("Notification Mark as Read successfully")
                if (notificationsData) {
                    const data = notificationsData.notifications.filter((n) => n.id !== notificationId)
                    setnotificationsData((prev) => ({
                        ...prev!,
                        notifications: data,
                        unreadCount: data.length
                    }))
                }
                handleFetchNotifications()
            }
        } catch (error) {
            toast.error("Notification failed Mark as Read") // Changed to toast.error for clarity
        }
    }, [notificationsData, handleFetchNotifications])

    useEffect(() => {
        handleFetchNotifications();
        const timerId = setInterval(() => {
            handleFetchNotifications()
        }, 300000)

        return () => clearInterval(timerId)
    }, [handleFetchNotifications])

    const notifications = notificationsData?.notifications || [];
    const unreadCount = notificationsData?.unreadCount || 0;

    return (
        // Responsive padding: px-4 on mobile, px-8 on desktop
        <header className="h-16 border-b border-border bg-[#0A0A0A] backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all">
            
            {/* Breadcrumb / Title Area */}
            <div className="text-lg font-mono text-gray-300 truncate mr-2">
                {/* Add content here if needed, currently empty */}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                
                {/* Search Component - Conditional Rendering & Responsive Width */}
                {role === "CREATOR" && (
                    <div className="w-full max-w-[150px] sm:max-w-xs transition-all">
                        <SearchComponent
                            isLoading={isLoading}
                            searchResults={searchResults}
                            onSearch={handleSearch}
                        />
                    </div>
                )}

                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger
                                className='relative p-2 rounded-full bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-red-500 transition-all focus:ring-1 focus:ring-red-600'
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-red-600 rounded-full text-[10px] sm:text-xs text-white flex items-center justify-center font-bold border-2 border-black">
                                        {unreadCount}
                                    </span>
                                )}
                            </NavigationMenuTrigger>

                            {/* Dropdown Content */}
                            <NavigationMenuContent
                                className="bg-zinc-900 rounded-xl shadow-2xl p-0 sm:p-4 border-zinc-800"
                            >
                                <div className="p-4 sm:p-2">
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-4 border-b border-gray-800 pb-2 flex items-center justify-between">
                                        <span>Notifications</span>
                                        {unreadCount > 0 && <span className="text-xs font-normal text-red-400 bg-red-400/10 px-2 py-1 rounded-full">{unreadCount} new</span>}
                                    </h3>
                                </div>
                                
                                {/* Responsive Width: w-[85vw] for mobile, w-[320px] for desktop */}
                                <ul className="flex flex-col gap-2 sm:gap-3 w-[85vw] sm:w-[320px] max-h-[60vh] sm:max-h-96 overflow-y-auto px-2 pb-2">
                                    {notifications?.map((notification) => (
                                        <ListItem
                                            key={notification.id}
                                            title={notification.title}
                                            href={notification.link || "#"}
                                            isRead={notification.isRead}
                                            onMarkasRead={handleMarkasRead}
                                            notificationId={notification.id}
                                        >
                                            {notification.message}
                                        </ListItem>
                                    ))}
                                    {notifications.length === 0 && (
                                        <li className="p-4 text-center text-sm text-gray-500">
                                            No new notifications.
                                        </li>
                                    )}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </header>
    );
};