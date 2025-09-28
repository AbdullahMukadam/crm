import React from 'react'
import KanbanBoardClient from './kanbanBoard.Client'

function DashboardClient() {
  return (
    <div className='w-full bg-amber-400 overflow-hidden'>
      <KanbanBoardClient />
    </div>
  )
}

export default DashboardClient