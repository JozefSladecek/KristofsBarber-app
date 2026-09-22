import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
    const hashedPassword = await bcrypt.hash("heslo123", 10);

    const employee = await db.user.create({
        data: {
            username: "dean",
            password: hashedPassword,
            name: "Dean",
            role: "EMPLOYEE",
        },
    });

    console.log("Vytvorený zamestnanec:", employee);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });