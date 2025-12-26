import { Invoice, InvoiceStatus, Project } from "@/types/project"
import { useCallback, useEffect, useState } from "react";
import { format, isAfter, parseISO } from "date-fns";

interface UseInvoicesProps {
    projects: Project[]
}

export interface InvoiceStats {
    totalPaid: number;
    pendingAmount: number;
    nextDueDate: string | null;
    nextDueInvoiceNumber: string | null;
    totalCount: number;
}

export function useInvoices({ projects }: UseInvoicesProps) {
    const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
    const [stats, setStats] = useState<InvoiceStats>({
        totalPaid: 0,
        pendingAmount: 0,
        nextDueDate: null,
        nextDueInvoiceNumber: null,
        totalCount: 0
    });

    const processInvoices = useCallback(() => {
        if (!projects) return;

        // 1. Flatten all invoices from all projects into one array
        // We assume project.invoices exists based on your schema
        const flatInvoices = projects.flatMap(p => p.invoices || []);

        // 2. Sort by Date (newest first)
        const sortedInvoices = [...flatInvoices].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setAllInvoices(sortedInvoices);

        // 3. Calculate Stats
        let paid = 0;
        let pending = 0;
        let nextDue: Date | null = null;
        let nextDueInvNum: string | null = null;

        sortedInvoices.forEach(inv => {
            const amount = Number(inv.amount); // Ensure decimal/string is number

            if (inv.status === "PAID") {
                paid += amount;
            } else if (inv.status === 'SENT' || inv.status === 'OVERDUE' || inv.status === 'DRAFT') {
                pending += amount;
                const due = new Date(inv.dueDate);
                if (!nextDue || (isAfter(nextDue, due))) {
                    nextDue = due;
                    nextDueInvNum = inv.invoiceNumber;
                }
            }
        });

        setStats({
            totalPaid: paid,
            pendingAmount: pending,
            nextDueDate: nextDue ? format(nextDue, "MMM dd, yyyy") : "No pending invoices",
            nextDueInvoiceNumber: nextDueInvNum,
            totalCount: sortedInvoices.length
        });

    }, [projects]);

    const handleSearchInvoices = (searchQuery: string) => {
        
        const flatInvoices = projects.flatMap(p => p.invoices || []);
        if (searchQuery.length === 0) {
            setAllInvoices(flatInvoices)
            return
        }
        let filteredInvoices = allInvoices.filter((inv) => {
            return inv.amount.toString() === searchQuery || inv.invoiceNumber === searchQuery
        })
        if (filteredInvoices) {
            setAllInvoices(filteredInvoices)
        } else {
            setAllInvoices(flatInvoices);
        }

    }

    const handleFilterInvoices = (status : InvoiceStatus) => {
        const flatInvoices = projects.flatMap(p => p.invoices || []);
        let filteredInvoices = flatInvoices.filter((inv) => inv.status === status)
        setAllInvoices(filteredInvoices)
    }

    useEffect(() => {
        processInvoices();
    }, [processInvoices]);

    return {
        invoices: allInvoices,
        stats,
        handleSearchInvoices,
        handleFilterInvoices
    }
}