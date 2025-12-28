'use client';

import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Updated config to ensure colors map correctly to CSS variables
const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    desktop: {
        label: "Desktop",
        color: "var(--primary)", 
    },
    mobile: {
        label: "Mobile",
        color: "var(--secondary)",
    },
} satisfies ChartConfig

interface ChartData {
    date: string;
    desktop: number;
    mobile: number;
    tablet: number;
}

export function LeadVisitsChart({ username }: { username: string }) {
    const [timeRange, setTimeRange] = useState('30d');
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVisitData = async () => {
            try {
                setLoading(true);
                const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

                // Simulated data fetch - replace with your actual API call
                const response = await fetch(`/api/creator/visits/${username}?days=${days}`);
                if (!response.ok) throw new Error('Failed to fetch visits');

                const data = await response.json();
                setChartData(data);
            } catch (error) {
                console.error('Error loading visit data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadVisitData();
    }, [username, timeRange]);

    const totalVisits = chartData.reduce(
        (sum, day) => sum + day.desktop + day.mobile + day.tablet,
        0
    );

    return (
        <Card className='w-full'>
            {/* Header: Stacked on mobile, Row on Desktop */}
            <CardHeader className="flex flex-col gap-4 space-y-0 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="space-y-1">
                    <CardTitle className="text-base sm:text-lg">Lead Form Visitors</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Total visits: {totalVisits} • Last{' '}
                        {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}
                    </CardDescription>
                </div>
                
                {/* Select: Full width on mobile, fixed width on desktop */}
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {loading ? (
                    <div className="flex h-[250px] items-center justify-center w-full">
                        <p className="text-sm text-muted-foreground animate-pulse">Loading visit data...</p>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex h-[250px] items-center justify-center w-full">
                        <p className="text-sm text-muted-foreground">No visit data available</p>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-desktop)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-desktop)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-mobile)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-mobile)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    });
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            });
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area
                                dataKey="mobile"
                                type="natural"
                                fill="url(#fillMobile)"
                                stroke="var(--color-mobile)"
                                stackId="a"
                            />
                            <Area
                                dataKey="desktop"
                                type="natural"
                                fill="url(#fillDesktop)"
                                stroke="var(--color-desktop)"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}