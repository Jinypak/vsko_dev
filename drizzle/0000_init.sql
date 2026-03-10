CREATE TABLE IF NOT EXISTS customers (
  id text PRIMARY KEY,
  name text NOT NULL,
  hsm_count integer NOT NULL DEFAULT 0,
  model text NOT NULL DEFAULT '',
  serials jsonb NOT NULL DEFAULT '[]'::jsonb,
  engineer text NOT NULL DEFAULT '',
  contacts jsonb NOT NULL DEFAULT '[]'::jsonb,
  histories jsonb NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS traffic_events (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  path text NOT NULL,
  visited_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS traffic_events_visited_at_idx ON traffic_events (visited_at);
CREATE INDEX IF NOT EXISTS traffic_events_path_idx ON traffic_events (path);
