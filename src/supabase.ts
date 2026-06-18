import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'sb_publishable_3xL_DiEYxsG-hsh3EB8-_w_lTYrqe1n';
const supabaseKey = 'sb_secret_lRoMWtremcHBnwa3IVQyGA_GWMJcEUs';

export const supabase = createClient(supabaseUrl, supabaseKey);
