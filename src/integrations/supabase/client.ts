// Production-ready Supabase client configuration
// Hardcoded credentials for Lovable deployment compatibility
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Hardcoded Supabase credentials (public values, safe for client-side)
// These are the anon/public keys designed for browser use, protected by RLS
const supabaseUrl = 'https://asrzdtpyrdgyggqdfwwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcnpkdHB5cmRneWdncWRmd3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjY4NDMsImV4cCI6MjA3NTc0Mjg0M30.dz9YKRsUNv4G7K9u-6ZyEVuRImInbt-pfaggB7SXGmM';

// Note: Lovable's build process doesn't support vite.config.ts define or .env files
// reliably, so we hardcode the public values directly. This is safe because:
// 1. These are public anon keys (designed for browser use)
// 2. Data is protected by Row Level Security (RLS) policies
// 3. Never hardcode the service role key (backend only!)

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Enhanced security with PKCE flow
  },
});