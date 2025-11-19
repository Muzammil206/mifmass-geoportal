import pg from "pg";
const { Pool } = pg;

// Prevent Next.js from creating multiple pools during hot reload
let globalPool;

if (!global.globalPool) {
  global.globalPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Only if you're using a cloud provider like Supabase / Render / Neon
  });
}

const db = global.globalPool;

export { db };
