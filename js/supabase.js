// Initialize Supabase Client
const SUPABASE_URL = "https://nmlavdpboacpyscuuhbx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbGF2ZHBib2FjcHlzY3V1aGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNDkwMTUsImV4cCI6MjA5ODYyNTAxNX0.-79WOnkkpMRmP0g7F9YvwJK9Q7bm6YIZ-IneeljPKdM";

// Ensure the Supabase CDN is loaded
if (typeof supabase === 'undefined') {
  console.error("Supabase CDN is not loaded!");
} else {
  // Expose the supabase client globally so other scripts can use it
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
