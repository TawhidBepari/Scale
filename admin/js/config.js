const SUPABASE_URL =
  "https://kkrybualwvnderbumjdd.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrcnlidWFsd3ZuZGVyYnVtamRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNjIxOTQsImV4cCI6MjA5MzgzODE5NH0.N0TBaamkdOg-BAVQ28DbTXhUO2nHTxwnGK8maQS0QQA";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
