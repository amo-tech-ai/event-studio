// db.js - Postgres.js connection setup
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get connection string from environment variables
const connectionString = process.env.SUPABASE_DB_URL_POOLER || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Missing DATABASE_URL environment variable');
}

// Create Postgres connection with proper configuration
const sql = postgres(connectionString, {
  // Important: Disable prepared statements for pooler connections
  prepare: false,
  
  // Connection pool settings
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
  
  // Enable debugging in development
  debug: process.env.NODE_ENV === 'development',
  
  // Transform snake_case to camelCase
  transform: {
    undefined: null
  }
});

export default sql;

// Example usage function
export async function getUsersOver(age) {
  const users = await sql`
    SELECT name, age
    FROM users
    WHERE age > ${age}
  `;
  return users;
}

// Test connection function
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful:', result[0].current_time);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}
