import { Project } from "./project";

export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface Proposal {
    id: string;
    project: Project;
    creatorId: string;
    clientId: string;
    amount: number;
    status: ProposalStatus;
}