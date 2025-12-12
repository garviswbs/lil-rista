-- Drop existing table if it exists (only if you want to recreate it)
DROP TABLE IF EXISTS attendees;

-- Create the attendees table with snake_case (PostgreSQL/Supabase standard)
-- Supabase will automatically convert to camelCase in JavaScript
CREATE TABLE attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  registration_type TEXT NOT NULL,
  drink_type TEXT NOT NULL,
  checked_in BOOLEAN DEFAULT false,
  received_badge BOOLEAN DEFAULT false,
  received_drink BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  checked_in_at TIMESTAMPTZ,
  badge_received_at TIMESTAMPTZ,
  drink_received_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT false
);

-- Create indexes for better query performance
CREATE INDEX idx_attendees_is_deleted ON attendees(is_deleted);
CREATE INDEX idx_attendees_checked_in ON attendees(checked_in);
CREATE INDEX idx_attendees_created_at ON attendees(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (since you want open access)
-- For production, you might want to restrict this
CREATE POLICY "Allow all operations on attendees"
ON attendees
FOR ALL
USING (true)
WITH CHECK (true);

-- Enable real-time for the attendees table
-- NOTE: This might fail if real-time isn't enabled. If it errors, skip this line
-- and enable real-time through the UI: Database → Replication → Toggle "attendees" ON
ALTER PUBLICATION supabase_realtime ADD TABLE attendees;

