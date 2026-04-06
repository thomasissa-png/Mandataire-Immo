-- Table feedback : retours clients
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  client_email TEXT NOT NULL,
  type TEXT NOT NULL, -- amelioration, bug, question, autre
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- new, read, resolved
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback (status);
