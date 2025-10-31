
import LeadCaptureForm from '@/components/form/leadCaptureForm';
import React from 'react'

interface PublicLeadPageProps {
    params: {
        username: string;
    };
    searchParams: { [key: string]: string | undefined };
}

function LeadCapturePage({ params, searchParams }: PublicLeadPageProps) {
    return (
        <div className='w-full'>
            <LeadCaptureForm />
        </div>
    )
}

export default LeadCapturePage