import { db } from "@/lib/db";

export async function GET(req, context) {
  const { country, layer } = await context.params;

  const schema = country.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
  const table = layer.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "geojson";

  // Check table exists
  const exists = await db.query(
    `SELECT to_regclass($1) AS name`,
    [`${schema}.${table}`]
  );

  if (!exists.rows[0].name) {
    return new Response(JSON.stringify({ error: "Layer not found" }), { status: 404 });
  }

  // -------------------------
  // GEOJSON EXPORT
  // -------------------------
  if (format === "geojson") {
    const sql = `
      SELECT jsonb_build_object(
        'type','FeatureCollection',
        'features', jsonb_agg(feature)
      ) AS geojson
      FROM (
          SELECT jsonb_build_object(
            'type','Feature',
            'geometry', ST_AsGeoJSON(geom)::jsonb,
            'properties', to_jsonb(t) - 'geom'
          ) AS feature
          FROM ${schema}.${table} AS t
      ) AS f;
    `;

    const result = await db.query(sql);

    return new Response(JSON.stringify(result.rows[0].geojson), {
      headers: {
        "Content-Type": "application/geo+json",
        "Content-Disposition": `attachment; filename="${table}.geojson"`
      }
    });
  }

  // -------------------------
  // CSV EXPORT (SAFE)
  // -------------------------
  if (format === "csv") {
    // fetch rows normally
    const rows = await db.query(`SELECT * FROM ${schema}.${table}`);

    if (rows.rowCount === 0) {
      return new Response("No data", { status: 200 });
    }

    // Build CSV manually
    const columns = Object.keys(rows.rows[0]);
    const header = columns.join(",");

    const body = rows.rows
      .map(row =>
        columns
          .map(col => {
            const value = row[col];
            if (value === null) return "";
            if (typeof value === "object") return `"${JSON.stringify(value)}"`; // geom or json
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\n");

    const csv = header + "\n" + body;

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${table}.csv"`
      }
    });
  }

  return new Response(JSON.stringify({ error: "Unsupported format" }), {
    status: 400
  });
}
