CREATE TABLE IF NOT EXISTS chat_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  user_name TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  latitude REAL,
  longitude REAL,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON chat_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_logs_user_name ON chat_logs (user_name);
