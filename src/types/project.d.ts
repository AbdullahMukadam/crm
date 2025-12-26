
export type ProjectStatus = "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"
export type DeliverableStatus = "pending_review" | "revisions_requested" | "approved"
export type InvoiceStatus = "DRAFT" | "PAID" | "SENT" | "OVERDUE"

export interface Project {
  proposalId: string | null;
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  clientId: string;
  description: string | null;
  status: ProjectStatus;
  deliverables?: Deliverable[]
  invoices?: Invoice[];
  creator: any;
  client: any;
  embedLink?: string
  Feedback?: Feedback[]
}

export interface CreateFeedbackRequest {
  id: string; // project id
  message: string;
}

export interface replyFeedbackRequest {
  id: string; // project id
  feedbackId: string;
  message: string;
}


export interface Feedback {
  id: string;
  message: string;
  authorId: string;
  projectId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    email: string;
    avatarUrl: string | null;
    role: string;
  };
  replies?: Feedback[]; // Recursive type for nested replies
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  linkUrl: string;
  fileUrl: string;
  status: DeliverableStatus
  submittedAt: Date;
  projectId: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: number;
  paidAt: Date
  status: InvoiceStatus;
  createdAt: Date;
  clientId: string
  projectId: string
  client: any
  project: any
}

export interface CreateInvoiceRequest {
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  status: InvoiceStatus;
  clientId: string
  projectId: string
}

export interface CreateInvoiceRespobse {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: number;
  paidAt: Date
  status: InvoiceStatus;
  createdAt: Date;
  clientId: string
  projectId: string;
  client: any;
  project: Project
}

export interface EditInvoiceRequest {
  id: string,
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  status: InvoiceStatus;
  clientId: string
  projectId: string
}