/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register a standard font (optional, but good for custom branding)
// Font.register({ family: 'Helvetica', fonts: [...] });

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica', color: '#333' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    brandTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
    invoiceTitle: { fontSize: 20, fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },
    metadata: { marginTop: 10, textAlign: 'right' },
    metadataRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 2 },
    metadataLabel: { width: 80, color: '#666' },
    metadataValue: { width: 100, textAlign: 'right', fontWeight: 'bold' },

    // Section for Client/Bill To
    section: { marginTop: 20, marginBottom: 20 },
    sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#666', marginBottom: 4, textTransform: 'uppercase' },
    content: { fontSize: 12 },

    // Table
    tableContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 20, borderWidth: 1, borderColor: '#eaeaea' },
    tableHeader: { flexDirection: 'row', borderBottomColor: '#eaeaea', backgroundColor: '#f9fafb', borderBottomWidth: 1, alignItems: 'center', height: 24, fontStyle: "normal", flexGrow: 1 },
    tableRow: { flexDirection: 'row', borderBottomColor: '#eaeaea', borderBottomWidth: 1, alignItems: 'center', height: 30, flexGrow: 1 },
    colDesc: { width: '70%', paddingLeft: 8 },
    colAmount: { width: '30%', paddingRight: 8, textAlign: 'right' },

    // Totals
    totalsContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
    totalRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    totalLabel: { width: 100, textAlign: 'right', paddingRight: 10, color: '#666' },
    totalValue: { width: 100, textAlign: 'right', fontWeight: 'bold', fontSize: 14 },

    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', color: '#999', fontSize: 10, borderTopWidth: 1, borderColor: '#eaeaea', paddingTop: 10 }
});

// We define a specific Type that matches the serialized data 
// (Strings instead of Decimals/Dates because this runs on the client)
interface InvoicePDFProps {
    invoice: {
        invoiceNumber: string;
        createdAt: string; // Serialized Date
        dueDate: string;   // Serialized Date
        amount: number;    // Serialized Decimal
        status: string;
        client: {
            username: string;
            email: string;
        };
        project: {
            title: string;
        };
    };
}

export const InvoicePDF = ({ invoice }: InvoicePDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.brandTitle}>YOUR BRAND</Text>
                    <Text style={{ fontSize: 10, marginTop: 4 }}>contact@yourbrand.com</Text>
                </View>
                <View>
                    <Text style={styles.invoiceTitle}>INVOICE</Text>
                    <View style={styles.metadata}>
                        <View style={styles.metadataRow}>
                            <Text style={styles.metadataLabel}>Invoice #:</Text>
                            <Text style={styles.metadataValue}>{invoice.invoiceNumber}</Text>
                        </View>
                        <View style={styles.metadataRow}>
                            <Text style={styles.metadataLabel}>Date:</Text>
                            <Text style={styles.metadataValue}>{invoice.createdAt}</Text>
                        </View>
                        <View style={styles.metadataRow}>
                            <Text style={styles.metadataLabel}>Due Date:</Text>
                            <Text style={styles.metadataValue}>{invoice.dueDate}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ height: 1, backgroundColor: '#eaeaea', marginBottom: 20 }} />

            {/* Bill To */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bill To</Text>
                <Text style={styles.content}>{invoice.client.username}</Text>
                <Text style={{ ...styles.content, color: '#666', fontSize: 10 }}>{invoice.client.email}</Text>
            </View>

            {/* Table */}
            <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                    <Text style={styles.colDesc}>Description</Text>
                    <Text style={styles.colAmount}>Amount</Text>
                </View>

                {/* Row 1: The Project */}
                <View style={styles.tableRow}>
                    <Text style={styles.colDesc}>Project Services: {invoice.project.title}</Text>
                    <Text style={styles.colAmount}>${invoice.amount.toFixed(2)}</Text>
                </View>
            </View>

            {/* Total */}
            <View style={styles.totalsContainer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>TOTAL DUE</Text>
                    <Text style={styles.totalValue}>${invoice.amount.toFixed(2)}</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Thank you for your business.</Text>
                <Text>Please make checks payable to Your Brand Name.</Text>
            </View>

        </Page>
    </Document>
);