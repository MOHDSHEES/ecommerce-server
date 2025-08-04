// config/supabaseClient.js

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config(); // Ensure dotenv is loaded to access .env variables

// Retrieve Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Basic validation to ensure environment variables are set
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.error(
    "Critical: Missing Supabase environment variables. Please check your .env file."
  );
  // In a real application, you might throw an error or handle this more gracefully.
  // For development, process.exit(1) is fine.
  process.exit(1);
}

// 1. Supabase Client (Anon/Public Key)
// Use this client for operations where Row Level Security (RLS) should apply.
// This is typically what your frontend (if you had one) would use,
// or what you'd use on the backend for actions that mirror user permissions
// (e.g., a logged-in user updating their own profile).
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. Supabase Service Role Client (Secret Key)
// Use this client for privileged backend operations that need to bypass RLS.
// Examples: creating users programmatically, sending emails, admin tasks,
// or operations that require writing to tables where users shouldn't have direct RLS write access.
// **NEVER EXPOSE THIS KEY ON THE CLIENT-SIDE!**
const supabaseServiceRole = createClient(supabaseUrl, supabaseServiceRoleKey);

// Export both clients
module.exports = {
  supabase,
  supabaseServiceRole,
};
