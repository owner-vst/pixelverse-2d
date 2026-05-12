import { config } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

for (const envPath of [
  resolve(__dirname, "../.env"),
  resolve(__dirname, "../../../packages/db/.env"),
  resolve(process.cwd(), "../../packages/db/.env"),
  resolve(process.cwd(), "packages/db/.env"),
  resolve(process.cwd(), ".env"),
]) {
  if (existsSync(envPath)) {
    config({ path: envPath, override: false });
  }
}

const databaseUrl = process.env.DATABASE_URL;
if (typeof databaseUrl !== "string" || databaseUrl.length === 0) {
  throw new Error(
    "DATABASE_URL is not set. Add it to packages/db/.env or export it before starting the app."
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

export default prisma;
