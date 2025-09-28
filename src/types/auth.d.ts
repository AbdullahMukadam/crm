import { Invoice } from "./invoice";
import { Project } from "./project";
import { Proposal } from "./proposal";

export type UserRole = 'admin' | 'client' | 'creator';

export interface APIResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export interface SignupCredentials {
    username?: string;
    password: string;
    email: string;
}

export interface SignupResponse {
    id: string;
    username: string;
    email: string;
    avatarUrl: string | null;
    role: UserRole;
    onboarded: boolean;
}

export interface SigninCredentials {
    password: string;
    email: string;
}

export interface SigninResponse {
    id: string;
    username: string;
    email: string;
    avatarUrl: string | null;
    role: UserRole;
    onboarded: boolean;
}

export interface OnboardRequest {
    role: UserRole;
    userId: string;
}

export interface OnboardResponse {
    id: string;
    username: string;
    email: string;
    avatarUrl: string | null;
    role: UserRole;
    onboarded: boolean;
}

export interface AuthState {
    id: string | null;
    username: string | null;
    email: string | null;
    avatarUrl?: string | null;
    role: UserRole | null;
    onboarded: boolean | null;
    isLoading?: boolean;
    error?: string | null;
    isAuthenticated?: boolean;
    isInitialized?: boolean;


    createdProjects?: Project[];
    clientProjects?: Project[];
    proposals?: Proposal[];
    invoices?: Invoice[]
}