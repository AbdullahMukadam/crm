"use client"
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SearchComponent from './search';
import { useSearch } from '@/hooks/useSearch';
import { NotificationsData } from '@/types/notifications';
import notificationService from '@/lib/api/notificarionService';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useAppSelector } from '@/lib/store/hooks';
import { useNotificationStream } from '@/hooks/useNotificationStream';

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
                           ${isRead ? 'bg-zinc-800' : 'bg-zinc-800 border'}`;

    const titleClassName = `text-sm font-semibold leading-none ${isRead ? 'text-gray-200' : 'text-white'}`;
    const messageClassName = `line-clamp-2 text-xs sm:text-sm leading-snug mt-1 ${isRead ? 'text-gray-500' : 'text-gray-400'}`;

    return (
        <li className={itemClassName} {...props}>
            <div className='hover:bg-transparent'>
                <div className="block w-full">
                    {!isRead && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#D27E4D] rounded-r-sm" aria-hidden="true"></span>
                    )}

                    <div className={titleClassName}>{title}</div>
                    <p className={messageClassName}>{children}</p>

                    <div className="flex justify-end mt-2">
                        {!isRead && <Button
                            variant={"outline"}
                            size="sm"
                            className="h-7 text-xs"
                            onClick={(e) => {
                                e.preventDefault();
                                onMarkasRead(notificationId);
                            }}
                        >
                            Mark as Read
                        </Button>}
                    </div>
                </div>
            </div>
        </li>
    )
}

export const Header: React.FC = () => {
    const { isLoading, searchResults, handleSearch } = useSearch();
    const { notificationsData, isConnected, setNotificationsData } = useNotificationStream();
    const { role } = useAppSelector((state) => state.auth);

    const handleMarkasRead = useCallback(async (notificationId: string) => {
        try {
            // Optimistic update
            setNotificationsData((prev) => {
                if (!prev) return prev;
                const updatedNotifications = prev.notifications.filter((n) => n.id !== notificationId);
                return {
                    ...prev,
                    notifications: updatedNotifications,
                    unreadCount: updatedNotifications.length
                };
            });

            const response = await notificationService.markasRead(notificationId);

            if (response.success) {
                toast.success("Notification marked as read");
            } else {
                throw new Error('Failed to mark as read');
            }
        } catch (error) {
            toast.error("Failed to mark as read");
            // Revert would require refetching or keeping a backup
            console.error(error);
        }
    }, [setNotificationsData]);

    const notifications = notificationsData?.notifications || [];
    const unreadCount = notificationsData?.unreadCount || 0;

    return (
        <header className="h-16 border-b border-border bg-background backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all">

            <div className="text-lg font-mono text-gray-300 truncate mr-2">
                {/* Connection status indicator (optional) */}
                {!isConnected && (
                    <span className="text-xs text-yellow-500">● Reconnecting...</span>
                )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {role === "CREATOR" && (
                    <div className="w-full max-w-[150px] sm:max-w-xs transition-all">
                        <SearchComponent
                            isLoading={isLoading}
                            searchResults={searchResults}
                            onSearch={handleSearch}
                        />
                    </div>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative rounded-full bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-red-500 transition-all focus-visible:ring-1 focus-visible:ring-red-600 outline-none"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-[#D27E4D] rounded-full text-[10px] sm:text-xs text-black flex items-center justify-center font-bold border-2 border-black">
                                    {unreadCount}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-[85vw] sm:w-[380px] bg-zinc-900 border-zinc-800 p-0 shadow-2xl rounded-xl overflow-hidden"
                    >
                        <div className="p-4 bg-zinc-900/50 backdrop-blur border-b border-zinc-800">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="text-xs font-medium text-[#D27E4D] bg-red-400/10 px-2 py-0.5 rounded-full">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto p-2">
                            <ul className="flex flex-col gap-2">
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
                                    <li className="py-8 text-center text-sm text-zinc-500">
                                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                        No new notifications
                                    </li>
                                )}
                            </ul>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};