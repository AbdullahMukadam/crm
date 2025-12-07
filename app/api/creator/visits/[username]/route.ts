
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const primsaClient = new PrismaClient()

export async function GET(
    request: NextRequest,
    { params }: { params: { username: string } }
) {
    try {
        const { username } = await params;
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '30');

        // Calculate start date
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Fetch visits from database
        const usernameTofind = username.toLowerCase()
        const visits = await primsaClient.formVisit.findMany({
            where: {
                username: usernameTofind,
                visitDate: {
                    gte: startDate,
                },
            },
            select: {
                deviceType: true,
                visitDate: true,
            },
            orderBy: {
                visitDate: 'asc',
            },
        });

        // Aggregate data by date
        const aggregatedData: Record<string, { date: string; desktop: number; mobile: number; tablet: number }> = {};

        visits.forEach((visit) => {
            const date = visit.visitDate.toISOString().split('T')[0];

            if (!aggregatedData[date]) {
                aggregatedData[date] = {
                    date,
                    desktop: 0,
                    mobile: 0,
                    tablet: 0,
                };
            }

            aggregatedData[date][visit.deviceType as keyof typeof aggregatedData[string]]++;
        });

        // Convert to array and ensure all dates in range are included
        const result = [];
        const currentDate = new Date(startDate);
        const endDate = new Date();

        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            result.push(
                aggregatedData[dateStr] || {
                    date: dateStr,
                    desktop: 0,
                    mobile: 0,
                    tablet: 0,
                }
            );
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching visits:', error);
        return NextResponse.json(
            { error: 'Failed to fetch visits' },
            { status: 500 }
        );
    }
}