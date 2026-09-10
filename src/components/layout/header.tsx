"use client"
import React, { useCallback } from 'react';
import { Bell, BellRing, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SearchComponent from './search';
import { useSearch } from '@/hooks/useSearch';
import notificationService from '@/lib/api/notificarionService';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useAppSelector } from '@/lib/store/hooks';
import { useNotificationStream } from '@/hooks/useNotificationStream';
import { cn, formatTimeAgo } from '@/lib/utils';

interface NotificationItemProps {
    title: string;
    message: string;
    href?: string | null;
    createdAt?: Date;
    isRead?: boolean;
    notificationId: string;
    onMarkasRead: (notificationId: string) => void;
}

function NotificationItem({
    title,
    message,
    href,
    createdAt,
    isRead = false,
    notificationId,
    onMarkasRead,
}: NotificationItemProps) {

    const body = (
        <div className="flex items-start gap-3">
            {!isRead && (
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
            )}
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <span className={cn("text-sm truncate", isRead ? "font-medium text-muted-foreground" : "font-semibold text-foreground")}>
                        {title}
                    </span>
                    {createdAt && (
                        <span className="shrink-0 text-[11px] text-muted-foreground">{formatTimeAgo(createdAt)}</span>
                    )}
                </div>
                <p className="text-xs sm:text-sm leading-snug mt-0.5 text-muted-foreground line-clamp-2">{message}</p>

                {!isRead ? (
                    <div className="flex items-center gap-2 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs border-border"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onMarkasRead(notificationId);
                            }}
                        >
                            Mark as read
                        </Button>
                        {href && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                            >
                                View
                            </Button>
                        )}
                    </div>
                ) : (
                    <span className="text-[11px] text-muted-foreground/70">Read</span>
                )}
            </div>
        </div>
    );

    return (
        <li className={cn(
            "flex items-center rounded-lg border px-3 py-2.5 transition-colors",
            isRead
                ? "border-transparent hover:bg-muted/50"
                : "bg-accent/60 border-border"
        )}>
            {href ? (
                <Link href={href} className="flex-1 min-w-0 group">
                    <div className="flex items-center gap-3">
                        {body}
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                    </div>
                </Link>
            ) : (
                <div className="flex-1 min-w-0">{body}</div>
            )}
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

            <div className="text-sm text-muted-foreground truncate mr-2">
                {!isConnected && (
                    <span className="text-yellow-500">● Reconnecting...</span>
                )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {role === "CREATOR" && (
                    <div className="w-full max-w-[150px] sm:max-w-sm md:max-w-md transition-all">
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
                            className="relative rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                            aria-label={`Notifications (${unreadCount} unread)`}
                        >
                            {unreadCount > 0 ? <BellRing size={20} /> : <Bell size={20} />}
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 bg-primary text-[10px] text-primary-foreground rounded-full flex items-center justify-center font-bold">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-[85vw] sm:w-[380px] bg-popover border-border p-0 shadow-2xl rounded-xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 bg-muted/40 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Bell size={16} className="text-muted-foreground" />
                                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            {!isConnected && (
                                <span className="text-[11px] text-yellow-500 flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                    Reconnecting
                                </span>
                            )}
                        </div>

                        <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto p-2">
                            <ul className="flex flex-col gap-1">
                                {notifications?.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        title={notification.title}
                                        message={notification.message}
                                        href={notification.link}
                                        createdAt={notification.createdAt}
                                        isRead={notification.isRead}
                                        onMarkasRead={handleMarkasRead}
                                        notificationId={notification.id}
                                    />
                                ))}
                                {notifications.length === 0 && (
                                    <li className="py-10 text-center text-sm text-muted-foreground">
                                        <span className="flex items-center justify-center size-12 mx-auto mb-3 rounded-full bg-muted border border-border">
                                            <Bell className="size-6 text-muted-foreground/50" />
                                        </span>
                                        You're all caught up
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