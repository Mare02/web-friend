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

-- Analyses table (stores complex data as JSON)
CREATE TABLE IF NOT EXISTS analyses (
  id TEXT PRIMARY KEY,
  user_id TEXT,                      -- NULL for anonymous users
  url TEXT NOT NULL,

  -- Store as JSON
  website_data TEXT NOT NULL,
  analysis_result TEXT NOT NULL,

  -- Action plan metadata
  action_plan_summary TEXT,
  action_plan_timeline TEXT,
  quick_wins TEXT,                   -- JSON array

  analyzed_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- Tasks table (normalized for querying)
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  analysis_id TEXT NOT NULL,
  user_id TEXT,                      -- Denormalized for fast queries

  -- Task attributes
  category TEXT NOT NULL CHECK(category IN ('seo', 'content', 'performance', 'accessibility')),
  priority TEXT NOT NULL CHECK(priority IN ('high', 'medium', 'low')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  effort TEXT NOT NULL CHECK(effort IN ('quick', 'moderate', 'significant')),
  impact TEXT NOT NULL CHECK(impact IN ('low', 'medium', 'high')),
  estimated_time TEXT,

  -- Task state (mutable)
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'skipped')),
  completed_at INTEGER,
  started_at INTEGER,
  notes TEXT,

  -- Reanalysis data
  last_reanalysis TEXT,              -- JSON string with reanalysis result
  last_reanalysis_at INTEGER,

  -- Ordering
  task_order INTEGER,

  -- Metadata
  created_at INTEGER NOT NULL,
  updated_at INTEGER,

  FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_analyses ON analyses(user_id, analyzed_at DESC);
CREATE INDEX IF NOT EXISTS idx_url ON analyses(url);
CREATE INDEX IF NOT EXISTS idx_analyzed_at ON analyses(analyzed_at DESC);

CREATE INDEX IF NOT EXISTS idx_tasks_analysis ON tasks(analysis_id, task_order);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_priority ON tasks(user_id, priority, status);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category, status);

