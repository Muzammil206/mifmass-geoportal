import { db } from "@/lib/db";

export async function GET(req, context) {
  const { country } = await context.params; // 👈 FIX

  const safeSchema = country.replace(/[^a-zA-Z0-9_]/g, "");

  const sql = `
    SELECT 
      table_name AS layer_name,
      (SELECT type 
       FROM geometry_columns 
       WHERE f_table_schema = $1 AND f_table_name = table_name
       LIMIT 1
      ) AS geom_type
    FROM information_schema.tables
    WHERE table_schema = $1
    ORDER BY table_name;
  `;

  const result = await db.query(sql, [safeSchema]);

  return Response.json(result.rows);
}
