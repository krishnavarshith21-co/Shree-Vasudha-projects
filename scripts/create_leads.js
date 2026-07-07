console.log("Please run this in the Supabase SQL Editor:");
console.log(`
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_interest TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a lead (from the public contact form)
CREATE POLICY "Enable insert access for all users" ON leads FOR INSERT WITH CHECK (true);

-- Only authenticated admins can read, update, or delete leads
CREATE POLICY "Enable all access for authenticated users" ON leads FOR ALL USING (auth.role() = 'authenticated');
`);
