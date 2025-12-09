import ProposalBuilderClient from '@/components/creator/proposalBuilder.Client'
import React from 'react'

async function ProposalBuilder({ params }: { params: Promise<{ ['proposal-id']: string }> }) {
  const data = await params
  const proposalId = data['proposal-id']
  return (
    <div className='w-full text-white min-h-screen font-brcolage-grotesque'>
      <ProposalBuilderClient proposalId={proposalId} />
    </div>
  )
}

export default ProposalBuilder