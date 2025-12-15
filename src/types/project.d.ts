
export type ProjectStatus = "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"
export type DeliverableStatus = "pending_review" | "revisions_requested" | "approved"
export type InvoiceStatus = "draft" | "paid" | "sent" | "overdue"

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

export interface CreateFeedbackRequest extends Project {
    message: string
}

export interface replyFeedbackRequest extends Project {
    message: string,
    feedbackId : string
}


export interface Feedback {
    id: string
    projectId: string
    authorId: string
    createdAt: Data
    updatedAt: Date
    message: string
    replies: Feedback[]
    author: any
    project: Project
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
}