import { createClient } from '@supabase/supabase-js';

// Replace YOUR_PROJECT_ID with the ID you found in Settings > General
const supabaseUrl = 'https://uvmqlkmvwjyswwdurgby.supabase.co';

// Use the key labeled 'anon' 'public' from Settings > API
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2bXFsa212d2p5c3d3ZHVyZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTMyMDcsImV4cCI6MjA5NzM2OTIwN30.L-9cSewUiuqp88xIlLEUrIJU0-vwiwwh3cz-Jm7yuKU'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
