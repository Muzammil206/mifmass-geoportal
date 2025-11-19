// /api/countries/route.js
import { db } from "@/lib/db";

export async function GET() {
  const result = await db.query(`  SELECT schema_name
  FROM information_schema.schemata
  WHERE schema_name NOT LIKE 'pg_%'
  AND schema_name <> 'information_schema';
`);

console.log("Countries schemas:", result.rows);
  return new Response(JSON.stringify(result.rows.map(r => r.country)), {
    headers: { "Content-Type": "application/json" },
  });
}
