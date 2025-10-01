import React from 'react'
import KanbanBoardClient from './kanbanBoard.Client'

function DashboardClient() {
  return (
    <div className='w-full overflow-hidden'>
      <KanbanBoardClient />
    </div>
  )
}

export default DashboardClient