// app/api/geojson/[country]/[layer]/route.js
import { db } from "@/lib/db";

export async function GET(req, context) {
  try {
    const { country, layer } = await context.params;
    const { searchParams } = new URL(req.url);
    
    const schema = country.toLowerCase();
    const layerName = layer.toLowerCase();
    
    // Optional bbox filter for performance
    const bbox = searchParams.get('bbox');
    
    let sql = `
      SELECT 
        json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(
            json_build_object(
              'type', 'Feature',
              'geometry', ST_AsGeoJSON(geom)::json,
              'properties', to_jsonb(row) - 'geom'
            )
          )
        ) as geojson
      FROM ${schema}.${layerName} as row
    `;
    
    if (bbox) {
      const [minLng, minLat, maxLng, maxLat] = bbox.split(',').map(Number);
      sql += ` WHERE geom && ST_MakeEnvelope($1, $2, $3, $4, 4326)`;
      const result = await db.query(sql, [minLng, minLat, maxLng, maxLat]);
      return new Response(JSON.stringify(result.rows[0].geojson), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      const result = await db.query(sql);
      return new Response(JSON.stringify(result.rows[0].geojson), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (err) {
    console.error("GeoJSON error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}