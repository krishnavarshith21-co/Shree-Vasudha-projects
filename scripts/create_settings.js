import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'admin-portal', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Service Role Key.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSettingsTable() {
  console.log("Setting up settings table...");

  // Since we can't easily run arbitrary DDL via the supabase-js client directly without a function,
  // wait, we CAN run it if we use the rest API, but actually we can just insert a row and let it fail if the table doesn't exist.
  // Oh, wait, the safest way to run DDL in JS is via a postgres client, OR we can just write the sql and I'll instruct the user to run it in the Supabase SQL editor.
  
  console.log("Please run this in the Supabase SQL Editor:");
  console.log(`
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON settings FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON settings FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO settings (key, value) VALUES ('global', '{
  "company_name": "Shree Vasudha Projects",
  "whatsapp": "+91 77024 36052",
  "email": "shreevasudhaprojects@gmail.com",
  "phone": "+91 77024 36052",
  "address": "Plot - 285, 5th Floor, H.No. 5-6-190, Vaidhehi Nagar, Saheb Nagar Kalan, BN Reddy Nagar, R.R. Dist., Telangana – 500070",
  "maps_link": "https://maps.google.com?q=Shree+vasudha+projects",
  "instagram": "",
  "facebook": "",
  "youtube": "",
  "linkedin": "",
  "analytics_id": "",
  "brand_color": "#b59b54"
}') ON CONFLICT (key) DO NOTHING;
  `);
}

createSettingsTable();
