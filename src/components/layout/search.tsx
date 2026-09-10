"use client"
import React, { useState, useEffect } from 'react';
import { Loader2, Search, X, UserSearch, ChevronRight } from 'lucide-react';
import { LeadsDataForDashboard } from '@/types/branding';
import { Card, CardContent } from '../ui/card';
import { cn, formatTimeAgo } from '@/lib/utils';

interface SearchComponentProps {
    onSearch: (query: string) => void;
    isLoading?: boolean;
    searchResults: LeadsDataForDashboard[];
}

const LEAD_STATUS_STYLES: Record<string, string> = {
    'new-lead': 'bg-primary/10 text-primary border-primary/30',
    'new': 'bg-primary/10 text-primary border-primary/30',
    'contacted': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    'replied': 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30',
    'in-progress': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    'closed': 'bg-muted text-muted-foreground border-border',
};

function getInitials(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function getStatusLabel(raw: string) {
    return raw.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const SearchComponent: React.FC<SearchComponentProps> = ({
    onSearch,
    isLoading = false,
    searchResults = []
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isResultsOpen, setIsResultsOpen] = useState(false);

    useEffect(() => {
        if (searchQuery.trim()) {
            const timerId = setTimeout(() => {
                onSearch(searchQuery);
            }, 300);

            return () => clearTimeout(timerId);
        }
    }, [searchQuery, onSearch]);

    const shouldShowResults = isResultsOpen && searchQuery.trim();

    const handleFocus = () => setIsResultsOpen(true);
    // Short delay to allow click on result before closing dropdown
    const handleBlur = () => setTimeout(() => setIsResultsOpen(false), 200);

    return (
        <div className="relative w-full">
            {/* Search Input Container */}
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground border border-input bg-background px-3 rounded-lg transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
                <Search size={16} className="shrink-0" />

                <input
                    placeholder='Search leads'
                    className='text-foreground bg-transparent p-1.5 w-full border-none outline-none pe-0 text-sm'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                />

                {searchQuery && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchQuery('');
                        }}
                    >
                        <X size={14} />
                    </button>
                )}

                {isLoading && <Loader2 size={16} className="animate-spin shrink-0 text-primary" />}
            </div>

            {/* Search Results Dropdown */}
            {shouldShowResults && (
                <Card className="absolute mt-2 w-full rounded-lg shadow-xl border border-border max-h-96 overflow-y-auto z-50 p-0">
                    <CardContent className="p-1.5">
                        {isLoading ? (
                            // Loading State
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 size={32} strokeWidth={2} className="text-primary animate-spin mb-3" />
                                <p className="text-muted-foreground text-sm">Searching leads...</p>
                            </div>
                        ) : searchResults.length > 0 ? (
                            // Results List
                            <ul className="flex flex-col">
                                {searchResults.map((lead) => (
                                    <li key={lead.id}>
                                        <button
                                            className="w-full px-3 py-2.5 rounded-md hover:bg-accent transition-colors text-left group flex items-center gap-3"
                                            onClick={() => {
                                                console.log('Selected lead:', lead);
                                                setIsResultsOpen(false);
                                            }}
                                        >
                                            {/* Avatar */}
                                            <span className="flex items-center justify-center size-9 shrink-0 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                                                {getInitials(lead.name)}
                                            </span>

                                            <span className="flex-1 min-w-0">
                                                <span className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-foreground text-sm font-semibold truncate">
                                                        {lead.name}
                                                    </span>
                                                    {lead.status && (
                                                        <span className={cn(
                                                            "shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-full border",
                                                            LEAD_STATUS_STYLES[lead.status.toLowerCase()] || "bg-muted text-muted-foreground border-border"
                                                        )}>
                                                            {getStatusLabel(lead.status)}
                                                        </span>
                                                    )}
                                                </span>

                                                <span className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                                                    {lead.email && <span className="truncate">{lead.email}</span>}
                                                    {lead.companyName && (
                                                        <>
                                                            <span className="shrink-0 text-muted-foreground/50">•</span>
                                                            <span className="truncate">{lead.companyName}</span>
                                                        </>
                                                    )}
                                                </span>

                                                <span className="block text-[11px] text-muted-foreground/70 mt-0.5">
                                                    {formatTimeAgo(lead.createdAt)}
                                                </span>
                                            </span>

                                            <ChevronRight className="size-4 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            // No Results State
                            <div className="flex flex-col items-center justify-center py-10 px-4">
                                <span className="flex items-center justify-center size-12 bg-primary/10 rounded-full mb-3 border border-primary/30">
                                    <UserSearch size={22} className="text-primary" />
                                </span>
                                <h4 className="text-foreground text-sm font-semibold mb-1">No leads found</h4>
                                <p className="text-muted-foreground text-xs text-center">
                                    Try a different search term.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SearchComponent;