import React from 'react'
import KanbanBoardClient from './kanbanBoard.Client'

function DashboardClient() {
  return (
    <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6'>
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Leads Pipeline</h1>
        <p className="text-sm text-muted-foreground">Track and manage your leads through the sales pipeline.</p>
      </div>
      <KanbanBoardClient />
    </div>
  )
}

export default DashboardClient