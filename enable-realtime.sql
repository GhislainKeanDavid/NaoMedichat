-- Enable Realtime for the Message table
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT/sql)

-- Enable Realtime on Message table
ALTER PUBLICATION supabase_realtime ADD TABLE "Message";

-- You can verify it's enabled by running:
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
