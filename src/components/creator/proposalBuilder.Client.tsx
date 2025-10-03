"use client"
import React from 'react'
import ProposalSidebar from './proposalSidebar'
import { CreatorSidebarItems } from '@/config/sidebarConfig'


function ProposalBuilderClient() {
  return (
    <div className='w-full'>
        <ProposalSidebar isCollapsed={false} setIsCollapsed={()=> {}} navItems={CreatorSidebarItems} />
    </div>
  )
}

export default ProposalBuilderClient