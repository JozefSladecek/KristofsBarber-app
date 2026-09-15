import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    const body = await request.json();

    const entry = await db.entry.create({
        data: {
            date: new Date(body.date),
            clients: Number(body.clients),
            cash: Number(body.cash),
            card: Number(body.card),
            note: body.note || null,
            userId: body.userId,
        },
    });

    return NextResponse.json(entry);
}