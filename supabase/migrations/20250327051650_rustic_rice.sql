/*
  # Create statistics table

  1. New Tables
    - `page_views`
      - `id` (uuid, primary key)
      - `view_count` (integer)
      - `last_viewed` (timestamp)
    - `contributors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text)
      - `github` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  view_count integer DEFAULT 0,
  last_viewed timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contributors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  github text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to page views"
  ON page_views
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to contributors"
  ON contributors
  FOR SELECT
  TO public
  USING (true);

-- Insert initial contributors
INSERT INTO contributors (name, role, github) VALUES
  ('Dr. David A. Huffman', 'Original Algorithm Creator', 'N/A'),
  ('John Smith', 'Lead Developer', 'johnsmith'),
  ('Alice Johnson', 'UI/UX Designer', 'alicej'),
  ('Bob Wilson', 'Algorithm Specialist', 'bobw');

-- Initialize page views counter
INSERT INTO page_views (view_count) VALUES (0);