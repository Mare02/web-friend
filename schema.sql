-- User profiles table (for Clerk authentication)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id TEXT PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  profile_image_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);


