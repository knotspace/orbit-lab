CREATE TABLE IF NOT EXISTS links (
 id TEXT PRIMARY KEY,
 mode TEXT NOT NULL CHECK(mode IN ('surprise','redirect')),
 destination TEXT,
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS visits (
 id TEXT PRIMARY KEY,
 link_id TEXT NOT NULL,
 ip TEXT NOT NULL,
 country TEXT,
 region TEXT,
 city TEXT,
 isp TEXT,
 org TEXT,
 asn TEXT,
 gps_lat REAL,
 gps_lon REAL,
 gps_at TEXT,
 created_at TEXT NOT NULL,
 FOREIGN KEY(link_id) REFERENCES links(id)
);
CREATE INDEX IF NOT EXISTS visits_created_at ON visits(created_at);
CREATE INDEX IF NOT EXISTS visits_link_id ON visits(link_id);
CREATE TABLE IF NOT EXISTS link_owners (
 link_id TEXT PRIMARY KEY,
 owner_token TEXT NOT NULL UNIQUE,
 FOREIGN KEY(link_id) REFERENCES links(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS link_owners_token ON link_owners(owner_token);
CREATE TABLE IF NOT EXISTS rate_limits (
 ip_hash TEXT NOT NULL,
 route TEXT NOT NULL,
 window_start INTEGER NOT NULL,
 count INTEGER NOT NULL,
 expires_at INTEGER NOT NULL,
 PRIMARY KEY(ip_hash, route, window_start)
);
