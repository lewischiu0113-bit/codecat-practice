import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tumnkqggbyvjzwrffuao.supabase.co';
const supabaseAnonKey = 'sb_publishable_tGgKUMW-rZe7U1zZUflBxQ_O0eQ9fXu';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

