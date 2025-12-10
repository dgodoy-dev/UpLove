-- Relationship Metadata table
CREATE TABLE IF NOT EXISTS relationship_metadata (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- Persons table
CREATE TABLE IF NOT EXISTS persons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- Necessities table
CREATE TABLE IF NOT EXISTS necessities (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE
);

-- Commitments table (supports both Todo and ToKeep)
CREATE TABLE IF NOT EXISTS commitments (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('todo', 'tokeep')),
  description TEXT NOT NULL,
  is_done INTEGER NOT NULL DEFAULT 0 CHECK(is_done IN (0, 1)),
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- Pillars table
CREATE TABLE IF NOT EXISTS pillars (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  priority TEXT NOT NULL CHECK(priority IN ('very low', 'low', 'medium', 'high', 'very high')),
  satisfaction INTEGER NOT NULL CHECK(satisfaction >= 1 AND satisfaction <= 10),
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- Uploves table
CREATE TABLE IF NOT EXISTS up_loves (
  id TEXT PRIMARY KEY,
  date INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- UpLove items specific data
CREATE TABLE IF NOT EXISTS up_love_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  up_love_id TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK(item_type IN ('to_improve', 'to_praise')),
  content TEXT NOT NULL,
  FOREIGN KEY (up_love_id) REFERENCES up_loves(id) ON DELETE CASCADE
);

-- Junction table for UpLove pillars
CREATE TABLE IF NOT EXISTS up_love_pillars (
  up_love_id TEXT NOT NULL,
  pillar_id TEXT NOT NULL,
  PRIMARY KEY (up_love_id, pillar_id),
  FOREIGN KEY (up_love_id) REFERENCES up_loves(id) ON DELETE CASCADE,
  FOREIGN KEY (pillar_id) REFERENCES pillars(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_necessities_person
  ON necessities(person_id);

CREATE INDEX IF NOT EXISTS idx_up_love_items_up_love
  ON up_love_items(up_love_id);

CREATE INDEX IF NOT EXISTS idx_up_love_items_type
  ON up_love_items(up_love_id, item_type);

CREATE INDEX IF NOT EXISTS idx_up_love_pillars_up_love
  ON up_love_pillars(up_love_id);

CREATE INDEX IF NOT EXISTS idx_up_love_pillars_pillar
  ON up_love_pillars(pillar_id);
