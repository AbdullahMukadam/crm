'use client';

import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { InvoicePDF } from './invoicePDF';

// Define loose types for the incoming invoice to handle Next.js serialization quirks
interface DownloadBtnProps {
    invoice: any;
    onDownload?: () => void; // Optional callback
}

export default function DownloadInvoiceBtn({ invoice, onDownload }: DownloadBtnProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    // 1. SAFER SERIALIZATION
    // We use Number() and new Date() because Next.js passes Server data as strings
    console.log(invoice)
    const serializedInvoice = {
        ...invoice,
        amount: Number(invoice.amount), // .toNumber() crashes on strings, Number() works on both
        createdAt: new Date(invoice.createdAt).toLocaleDateString(),
        dueDate: new Date(invoice.dueDate).toLocaleDateString(),
        client: {
            username: invoice.client.username,
            email: invoice.client.email
        },
        project: {
            title: invoice.project.title
        }
    };

    return (
        <PDFDownloadLink
            document={<InvoicePDF invoice={serializedInvoice} />}
            fileName={`invoice-${invoice.invoiceNumber}.pdf`}
        >
            {/* 2. RENDER PROP PATTERN */}
            {/* We use this function to access the 'loading' state */}
            {({ loading }) => (
                <Button
                    variant="outline"
                    disabled={loading}
                    onClick={() => {
                        // Only fire callback if not loading
                        if (!loading && onDownload) onDownload();
                    }}
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="mr-2 h-4 w-4" />
                    )}
                    {loading ? 'Generating...' : 'Download Invoice'}
                </Button>
            )}
        </PDFDownloadLink>
    );
}