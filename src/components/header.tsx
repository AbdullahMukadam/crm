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

function ListItem({
    title,
    children,
    href,
    isRead = false, // Added isRead prop for styling
    onMarkasRead,
    notificationId,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string; isRead?: boolean, onMarkasRead: (notificationId: string) => void, notificationId: string }) {
    // Determine background based on read status
    const itemClassName = `relative p-4 rounded-lg transition-colors duration-200 
                           ${isRead ? 'bg-zinc-800' : 'bg-zinc-800 border border-red-900/50'}`;

    const titleClassName = `text-sm font-semibold leading-none ${isRead ? 'text-gray-200' : 'text-white'}`;
    const messageClassName = `line-clamp-2 text-sm leading-snug ${isRead ? 'text-gray-500' : 'text-gray-400'}`;
    const buttonClassName = `mt-3 inline-flex items-center text-xs font-medium 
                             ${isRead ? 'text-gray-600 hover:text-red-600' : 'text-red-400 hover:text-red-600'}`;

    return (
        <li className={itemClassName} {...props}>
            <NavigationMenuLink asChild className='hover:bg-transparent'>
                <div className="block w-full">

                    {/* Unread indicator - a small red dot/line */}
                    {!isRead && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-600 rounded-r-sm" aria-hidden="true"></span>
                    )}

                    <div className={titleClassName}>{title}</div>
                    <p className={messageClassName}>{children}</p>

                    <div className="flex justify-end">
                        <Button variant={"outline"} onClick={() => onMarkasRead(notificationId)}>Mark as Read</Button>
                    </div>
                </div>
            </NavigationMenuLink>
        </li>
    )
}

export const Header: React.FC = () => {
    const { isLoading, searchResults, handleSearch } = useSearch()
    const [notificationsData, setnotificationsData] = useState<NotificationsData | null>(null)

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
                        ...prev,
                        notifications: data,
                        unreadCount: data.length
                    }))
                }
                handleFetchNotifications()
            }
        } catch (error) {
            toast.success("Notification failed Mark as Read")
        }
    }, [])

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
        <header className="h-16 border-b border-border bg-[#0A0A0A] backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
            {/* Breadcrumb / Title */}
            <div className="text-lg font-mono text-gray-300">
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            {/* Notification Bell Trigger - Subtle gray with a clear red indicator */}
                            <NavigationMenuTrigger
                                className='relative p-2 rounded-full bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-red-500 transition-all focus:ring-1 focus:ring-red-600'
                            >
                                <Bell size={20} />
                                {/* Unread count indicator (Red circle for prominence) */}
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 rounded-full text-xs text-white flex items-center justify-center font-bold border-2 border-black">
                                        {unreadCount}
                                    </span>
                                )}
                            </NavigationMenuTrigger>

                            {/* Navigation Menu Content (Dropdown) */}
                            <NavigationMenuContent
                                // Dropdown Container Styling: Dark background, light border, small padding
                                className="bg-zinc-900 rounded-xl shadow-2xl p-4"
                            >
                                <div className="p-2">
                                    <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">
                                        Notifications
                                        {unreadCount > 0 && <span className="text-red-600 ml-2">({unreadCount} new)</span>}
                                    </h3>
                                </div>
                                <ul className="flex flex-col gap-3 w-[290px] max-h-96 overflow-y-auto">
                                    {notifications?.map((notification) => (
                                        <ListItem
                                            key={notification.id}
                                            title={notification.title}
                                            href={notification.link || "#"}
                                            isRead={notification.isRead} // Pass isRead status
                                            onMarkasRead={handleMarkasRead}
                                            notificationId={notification.id}
                                        >
                                            {notification.message}
                                        </ListItem>
                                    ))}
                                    {notifications.length === 0 && (
                                        <li className="p-4 text-center text-gray-500">
                                            No new notifications.
                                        </li>
                                    )}
                                </ul>


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