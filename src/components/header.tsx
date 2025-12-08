import React from 'react';
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

export const Header: React.FC = () => {
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
                                {/* <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span> */}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <NavigationMenuLink>Link</NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white border border-gray-800 px-4 rounded-2xl">
                    <input
                        placeholder='Search Leads'
                        className='text-white p-1 border-none outline-none border-transparent focus:border-transparent focus:ring-0'
                    />
                    <Search size={20} />
                </div>
            </div>
        </header>
    );
};