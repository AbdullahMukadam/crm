import Link from 'next/link'
import React from 'react'

function ProposalsPage() {
  return (
    <div className='w-full text-white'>
        <Link href="/proposals/builder" className='px-4 py-2 rounded-lg'>Create New Proposal</Link>
    </div>
  )
}

export default ProposalsPage