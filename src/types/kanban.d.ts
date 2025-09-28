// types/kanban.ts

export interface Task {
    id: string;
    title: string;
    
  }
  
  export interface Column {
    id: string; // e.g., 'new-lead', 'contacted'
    title: string;
    tasks: Task[];
  }

 