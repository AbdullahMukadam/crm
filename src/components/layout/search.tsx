"use client"
import React, { useState, useEffect } from 'react';
import { Loader2, Search, User } from 'lucide-react';
import { LeadsDataForDashboard } from '@/types/branding';
// Assuming Card and CardContent are styled for a dark theme (e.g., using bg-gray-800)
import { Card, CardContent } from '../ui/card';

interface SearchComponentProps {
    onSearch: (query: string) => void;
    isLoading?: boolean;
    searchResults: LeadsDataForDashboard[];
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
        } else {
            // Optionally clear results when search is empty
            // onSearch(''); 
        }
    }, [searchQuery, onSearch]);

    // Use a function to check if the user is actively searching
    const shouldShowResults = isResultsOpen && searchQuery.trim();

    const handleFocus = () => setIsResultsOpen(true);
    // Short delay to allow click on result before closing dropdown
    const handleBlur = () => setTimeout(() => setIsResultsOpen(false), 200);

    const formatTimeAgo = (date?: Date) => {
        if (!date) return 'Recently';
        const now = new Date();
        const past = new Date(date);
        const diffMs = now.getTime() - past.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    return (
        <div className="relative w-full max-w-2xl font-brcolage-grotesque">
            {/* Search Input Container - Dark background, red border on focus */}
            <div className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white border border-gray-800 px-4 rounded-2xl">

                <input

                    placeholder='Search Leads'

                    className='text-white p-1 border-none outline-none border-transparent focus:border-transparent focus:ring-0'

                    value={searchQuery}

                    onChange={(e) => setSearchQuery(e.target.value)}

                    onBlur={handleBlur}

                    onFocus={handleFocus}

                />

                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={20} />}



            </div>

            {/* Search Results Dropdown */}
            {shouldShowResults && (
                // Adjusted Card for Black/Red Theme: Dark background, slight red border/shadow
                <Card className="absolute mt-2 w-full rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50 p-0">
                    <CardContent className="p-0">
                        {isLoading ? (
                            // Loading State
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 size={40} strokeWidth={2} className="text-red-600 animate-spin mb-3" />
                                <p className="text-gray-400 text-sm">Searching leads...</p>
                            </div>
                        ) : searchResults.length > 0 ? (
                            // Results List
                            <div className="divide-y divide-gray-800">
                                {searchResults.map((lead) => (
                                    <button
                                        key={lead.id}
                                        className="w-full px-4 py-3 hover:bg-zinc-900 transition-colors text-left group"
                                        onClick={() => {
                                            console.log('Selected lead:', lead);
                                            setIsResultsOpen(false);
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* User Icon/Avatar Placeholder */}
                                            {/* <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                                                <User size={16} className="text-red-400 group-hover:text-white" />
                                            </div> */}

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {/* Lead Name */}
                                                    <h4 className="text-white text-base font-semibold truncate">
                                                        {lead.name}
                                                    </h4>
                                                    {/* Status Tag - Red/Dark Red accent */}
                                                    {lead.status && (
                                                        <span className="px-2 py-0.5 bg-background text-[#D27E4D] text-xs font-medium rounded-full border border-[#D27E4D]">
                                                            {lead.status}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Sub-info: Email & Company */}
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    {lead.email && (
                                                        <span className="truncate">{lead.email}</span>
                                                    )}
                                                </div>

                                                {/* Timestamp */}
                                                {lead.updatedAt && (
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Last created: <span className="text-gray-500">{formatTimeAgo(lead.createdAt)}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            // No Results State
                            <div className="flex flex-col items-center justify-center py-12 px-4">
                                <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mb-3 border border-red-700">
                                    <Search size={24} className="text-red-500" />
                                </div>
                                <h4 className="text-white text-base font-semibold mb-1">No leads found</h4>
                                <p className="text-gray-500 text-sm text-center">
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