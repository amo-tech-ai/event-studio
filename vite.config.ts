import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Define environment variables inline for Lovable deployment
  // These are PUBLIC values, safe to hardcode (protected by RLS)
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://asrzdtpyrdgyggqdfwwl.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcnpkdHB5cmRneWdncWRmd3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjY4NDMsImV4cCI6MjA3NTc0Mjg0M30.dz9YKRsUNv4G7K9u-6ZyEVuRImInbt-pfaggB7SXGmM'),
    'import.meta.env.VITE_SUPABASE_PROJECT_ID': JSON.stringify('asrzdtpyrdgyggqdfwwl'),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify('sb_publishable_TxiT_vg3a3sCportkSNh3g_dVVq1LSZ'),
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase chunk size warning limit to 1000kb
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better code organization
        manualChunks: {
          // Vendor chunks - React Query bundled with React to avoid instance issues
          'react-vendor': ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ],
          'chart-vendor': ['recharts'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
  },
}));
