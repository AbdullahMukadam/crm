import LeadCaptureForm from '@/components/creator/leadCaptureForm';
import { CREATOR_API_ENDPOINTS } from '@/constants/creator';
import { FetchClient } from '@/lib/api/fetchClient';
import React from 'react';

interface PublicLeadPageProps {
    params: Promise<{
        username: string;
    }>
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

async function LeadCapturePage({ params, searchParams }: PublicLeadPageProps) {
    const { username } = await params;
    try {
        const url = process.env.NEXT_PUBLIC_APP_URL + CREATOR_API_ENDPOINTS.TRACK_VISIT
        await FetchClient.makeRequest(url, {
            method: "POST",
            body: JSON.stringify({ username })
        });
    } catch (error) {
        console.error('Failed to track visit:', error);
    }

    return (
        <div className="w-full">
            <LeadCaptureForm username={username} />
        </div>
    );
}

export default LeadCapturePage;