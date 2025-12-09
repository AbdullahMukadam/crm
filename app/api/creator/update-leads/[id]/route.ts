import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prismaClient = new PrismaClient()

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { status } = await request.json();
        const {id} = await params

        const updatedLead = await prismaClient.lead.update({
            where: { id: id },
            data: { status },
        });

        return NextResponse.json({ success: true, data: updatedLead, message: "Lead Sttaus Updated Successfully" });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to update lead' },
            { status: 500 }
        );
    }
}