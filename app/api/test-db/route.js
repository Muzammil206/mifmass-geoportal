import { db } from "@/lib/db";

export async function GET() {
  try {
    const result = await db.query("SELECT NOW()");
    return Response.json({ status: "ok", time: result.rows[0] });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
