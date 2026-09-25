// This script seeds the database with mock/test users for development.
// Passwords are randomly generated below and printed to the console ONCE.
// Run it LOCALLY (pnpm exec tsx prisma/seed.ts) whenever you need fresh test data.
//
// NOTE:
// This file contains no real credentials — passwords are generated randomly
// at runtime and only printed to the console, never written into the file.
// It is therefore safe to commit. If you ever hardcode a real password here
// for quick testing, remove it before committing.
// - An earlier version of this file is visible in this repo's older commits.
//   It only ever contained test/mock credentials, used purely for development
//   purposes. Those test users have since been deleted from the database, so
//   those old credentials no longer grant access to anything.

import "dotenv/config";
import crypto from "crypto";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

// Generates a random, URL-safe password string, e.g. "K7pQ2xR9mZaF"
function generatePassword(length = 12): string {
    return crypto
        .randomBytes(length)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, length);
}

async function main() {
    // Mock data only — replace or extend with real accounts later as needed.
    const users = [
        { username: "mock-admin", name: "Mock Admin", role: "ADMIN" as const },
        { username: "mock-owner", name: "Mock Owner", role: "OWNER" as const },
        { username: "mock-employee-1", name: "Mock Employee 1", role: "EMPLOYEE" as const },
        { username: "mock-employee-2", name: "Mock Employee 2", role: "EMPLOYEE" as const },
    ];

    const plainPasswords: { username: string; password: string }[] = [];

    for (const user of users) {
        const plainPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const created = await db.user.create({
            data: {
                username: user.username,
                password: hashedPassword,
                name: user.name,
                role: user.role,
            },
        });

        plainPasswords.push({ username: user.username, password: plainPassword });
        console.log(`Created ${user.role}:`, created.username);
    }

    console.log("\n=== SAVE THESE PASSWORDS NOW — they will not be shown again ===");
    for (const u of plainPasswords) {
        console.log(`${u.username}: ${u.password}`);
    }
    console.log("=================================================================\n");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });