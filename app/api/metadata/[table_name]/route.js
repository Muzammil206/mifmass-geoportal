import { db } from "@/lib/db";

export async function GET(req, context) {
  const { table_name } = await context.params; 

 

  const sql = `
     SELECT 
        id,
        country_schema,
        table_name,
        table_type,
        title,
        production_date,
        edition_date,
        abstract,
        organization,
        contact_role,
        email,
        spatial_representation,
        geometry_type,
        equivalent_scale,
        reference_system,
        distributor,
        language,
        access_constraints,
        use_constraints,
        maintenance_frequency,
        keywords,
        hierarchy_level,
        lineage_statement,
        metadata_contact,
        metadata_contact_role,
        metadata_contact_email,
        updated_by,
        created_at,
        updated_at
      FROM public.dataset_metadata 
      WHERE table_name = $1
  `;

  const result = await db.query(sql, [table_name]);

  return Response.json(result.rows);
}
