// Production-ready Supabase client configuration
// Environment variables are injected at build time by Vite
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Hardcoded Supabase credentials (public values, safe for client-side)
const supabaseUrl = 'https://asrzdtpyrdgyggqdfwwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcnpkdHB5cmRneWdncWRmd3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjY4NDMsImV4cCI6MjA3NTc0Mjg0M30.dz9YKRsUNv4G7K9u-6ZyEVuRImInbt-pfaggB7SXGmM';

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