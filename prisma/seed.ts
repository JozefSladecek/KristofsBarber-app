import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await db.user.create({
        data: {
            username: "admin",
            password: hashedPassword,
            name: "Jozef",
            role: "ADMIN",
        },
    });

    console.log("Vytvorený admin:", admin);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });