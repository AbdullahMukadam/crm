import ReviewProjectComponent from '@/components/common/reviewProject'
import React from 'react'

async function ReviewPage({ params }: { params: Promise<{ ['project-id']: string }> }) {
    const data = await params
    const projectId = data["project-id"]
    return (
        <div className='w-full min-h-screen'>
            <ReviewProjectComponent projectId={projectId} />
        </div>
    )
}

export default ReviewPage