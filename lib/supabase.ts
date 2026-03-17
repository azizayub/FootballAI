import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

export const SUPABASE_URL = 'https://tttahpvwxmtyeczfbmfk.supabase.co';
export const SUPABASE_ANON_KEY =
  'sb_publishable_RK4QEtSNv6d5KjKpd42Org_095-Im0C';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
