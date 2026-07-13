import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = () => {
  return createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_KEY
  );
};