#!/usr/bin/env node

/**
 * Generate API specification from Supabase schema
 * This script connects to Supabase and generates OpenAPI spec from the database schema
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Base OpenAPI specification
const baseSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Infrastructure Fix Citizen API',
    description: 'A comprehensive API for reporting and managing infrastructure issues in Nigeria.',
    version: '1.0.0',
    contact: {
      name: 'Infrastructure Fix Citizen Team',
      url: 'https://github.com/your-username/infra-fix-citizen',
      email: 'support@citizn.ng',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: supabaseUrl + '/rest/v1',
      description: 'Supabase API',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token from Clerk authentication',
      },
    },
  },
};

// Type mappings from PostgreSQL to OpenAPI
const typeMapping = {
  'character varying': 'string',
  'varchar': 'string',
  'text': 'string',
  'integer': 'integer',
  'bigint': 'integer',
  'numeric': 'number',
  'decimal': 'number',
  'real': 'number',
  'double precision': 'number',
  'boolean': 'boolean',
  'timestamp with time zone': 'string',
  'timestamp': 'string',
  'date': 'string',
  'uuid': 'string',
  'json': 'object',
  'jsonb': 'object',
  'array': 'array',
};

function mapPostgreSQLType(pgType, isArray = false) {
  const baseType = typeMapping[pgType] || 'string';
  
  if (isArray) {
    return {
      type: 'array',
      items: { type: baseType },
    };
  }
  
  const result = { type: baseType };
  
  // Add format for specific types
  if (pgType === 'uuid') {
    result.format = 'uuid';
  } else if (pgType.includes('timestamp')) {
    result.format = 'date-time';
  } else if (pgType === 'date') {
    result.format = 'date';
  }
  
  return result;
}

async function generateApiSpec() {
  console.log('🔍 Generating API specification from Supabase schema...\n');
  
  try {
    // Get table information
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .neq('table_name', 'schema_migrations');
    
    if (tablesError) {
      throw tablesError;
    }
    
    console.log(`📋 Found ${tables.length} tables:`, tables.map(t => t.table_name).join(', '));
    
    const schemas = {};
    const paths = {};
    
    // Generate schemas for each table
    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`🔍 Processing table: ${tableName}`);
      
      // Get column information
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', tableName)
        .order('ordinal_position');
      
      if (columnsError) {
        console.warn(`⚠️ Could not get columns for ${tableName}:`, columnsError.message);
        continue;
      }
      
      // Generate schema
      const properties = {};
      const required = [];
      
      columns.forEach(column => {
        const isArray = column.data_type === 'ARRAY';
        const baseType = isArray ? 'text' : column.data_type;
        
        properties[column.column_name] = mapPostgreSQLType(baseType, isArray);
        
        if (column.is_nullable === 'NO' && !column.column_default) {
          required.push(column.column_name);
        }
      });
      
      // Create schema name (capitalize first letter)
      const schemaName = tableName.charAt(0).toUpperCase() + tableName.slice(1).replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      
      schemas[schemaName] = {
        type: 'object',
        properties,
        ...(required.length > 0 && { required }),
      };
      
      // Generate basic CRUD paths
      paths[`/${tableName}`] = {
        get: {
          summary: `Get all ${tableName}`,
          tags: [schemaName],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: `#/components/schemas/${schemaName}` },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: `Create ${tableName.slice(0, -1)}`,
          tags: [schemaName],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: `#/components/schemas/${schemaName}` },
              },
            },
          },
          responses: {
            '201': {
              description: 'Created successfully',
              content: {
                'application/json': {
                  schema: { $ref: `#/components/schemas/${schemaName}` },
                },
              },
            },
          },
        },
      };
      
      paths[`/${tableName}/{id}`] = {
        get: {
          summary: `Get ${tableName.slice(0, -1)} by ID`,
          tags: [schemaName],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
            },
          ],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: { $ref: `#/components/schemas/${schemaName}` },
                },
              },
            },
          },
        },
        patch: {
          summary: `Update ${tableName.slice(0, -1)}`,
          tags: [schemaName],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: `#/components/schemas/${schemaName}` },
              },
            },
          },
          responses: {
            '200': {
              description: 'Updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: `#/components/schemas/${schemaName}` },
                },
              },
            },
          },
        },
        delete: {
          summary: `Delete ${tableName.slice(0, -1)}`,
          tags: [schemaName],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
            },
          ],
          responses: {
            '204': {
              description: 'Deleted successfully',
            },
          },
        },
      };
    }
    
    // Combine everything
    const fullSpec = {
      ...baseSpec,
      paths,
      components: {
        ...baseSpec.components,
        schemas,
      },
    };
    
    // Write to file
    const outputPath = path.join(__dirname, '..', 'src', 'docs', 'generated-api-spec.yaml');
    const yamlContent = yaml.stringify(fullSpec);
    
    fs.writeFileSync(outputPath, yamlContent, 'utf8');
    
    console.log(`\n✅ API specification generated successfully!`);
    console.log(`📁 Output: ${outputPath}`);
    console.log(`📊 Generated ${Object.keys(schemas).length} schemas and ${Object.keys(paths).length} paths`);
    
    // Also generate JSON version
    const jsonPath = path.join(__dirname, '..', 'src', 'docs', 'generated-api-spec.json');
    fs.writeFileSync(jsonPath, JSON.stringify(fullSpec, null, 2), 'utf8');
    console.log(`📁 JSON version: ${jsonPath}`);
    
  } catch (error) {
    console.error('❌ Error generating API specification:', error.message);
    process.exit(1);
  }
}

// Run the generator
generateApiSpec();
