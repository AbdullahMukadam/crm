
import ProposalViewerClient from '@/components/creator/proposalViewer.Client'
import React from 'react'

async function ProposalViewer({ params }: { params: Promise< { ['proposal-id']: string }> }) {
  const data = await params
  const proposalId = data['proposal-id']
  return (
    <div className='w-full text-white min-h-screen font-brcolage-grotesque'>
      <ProposalViewerClient proposalId={proposalId} />
    </div>
  )
}

export default ProposalViewer