const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'admin-portal/.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('settings').select('*').eq('key', 'global').single();
  console.log(data, error);
}
check();
