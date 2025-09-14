
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';


export interface Invoice {
    id: string;
    projectId: string;
    clientid: string;
    amount: number;
    dueDate: Date;
    paidAt?: Date;
    status: InvoiceStatus;
}