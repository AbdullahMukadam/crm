
import LeadCaptureForm from '@/components/form/leadCaptureForm';
import React from 'react'

interface PublicLeadPageProps {
    params: {
        username: string;
    };
    searchParams: { [key: string]: string | undefined };
}

async function LeadCapturePage({ params, searchParams }: PublicLeadPageProps) {
    const { username } = await params

    return (
        <div className='w-full'>
            <LeadCaptureForm username={username} />
        </div>
    )
}

export default LeadCapturePage