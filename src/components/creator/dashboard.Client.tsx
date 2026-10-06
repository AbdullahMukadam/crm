import React from 'react'
import KanbanBoardClient from './kanbanBoard.Client'

function DashboardClient() {
  return (
    <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6'>
      <KanbanBoardClient />
    </div>
  )
}

export default DashboardClient