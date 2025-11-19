// app/api/tiles/[country]/[layer]/[z]/[x]/[y]/route.js
import { db } from "@/lib/db";

export async function GET(req, context) {
  try {
    const { country, layer, z, x, y } = await context.params;

    // Validate parameters
    if (!country || !layer || !z || !x || !y) {
      return new Response(JSON.stringify({ error: "Missing required parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const schema = country.toLowerCase();
    const layerName = layer.toLowerCase();

    const zoom = parseInt(z);
    const tileX = parseInt(x);
    const tileY = parseInt(y);

    console.log(`Generating tile: ${schema}.${layerName} z:${zoom} x:${tileX} y:${tileY}`);

    // FIX: Improved SQL query with better CRS handling
    const sql = `
      WITH bounds AS (
        SELECT ST_TileEnvelope($1, $2, $3) AS bounds_3857
      )
      SELECT ST_AsMVT(tile, $4, 4096, 'geom') AS mvt
      FROM (
        SELECT 
          *,
          ST_AsMVTGeom(
            -- FIX: Ensure proper transformation to Web Mercator (3857)
            CASE 
              WHEN ST_SRID(geom) = 4326 THEN ST_Transform(geom, 3857)
              WHEN ST_SRID(geom) = 3857 THEN geom
              ELSE ST_Transform(geom, 3857)
            END,
            (SELECT bounds_3857 FROM bounds),
            4096,
            256,
            true
          ) AS geom
        FROM ${schema}.${layerName}
        WHERE ST_Intersects(
          geom,
          -- FIX: Transform tile envelope to data's CRS for proper filtering
          ST_Transform((SELECT bounds_3857 FROM bounds), ST_SRID(geom))
        )
      ) AS tile
    `;

    const result = await db.query(sql, [zoom, tileX, tileY, layerName]);

    if (!result.rows[0] || !result.rows[0].mvt) {
      console.log(`Empty tile for ${schema}.${layerName}`);
      return new Response(null, { status: 204 });
    }

    const mvtData = result.rows[0].mvt;
    console.log(`Tile generated, size: ${mvtData.length} bytes`);

    return new Response(mvtData, {
      status: 200,
      headers: { 
        "Content-Type": "application/vnd.mapbox-vector-tile",
        "Cache-Control": "public, max-age=3600"
      },
    });

  } catch (err) {
    console.error("Tile generation error:", err);
    
    if (err.message.includes('relation') && err.message.includes('does not exist')) {
      return new Response(JSON.stringify({ error: "Layer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}