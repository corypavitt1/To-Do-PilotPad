/*
  # Add Role-Based Access and FAA Categories System

  1. New Tables
    - `faa_categories` - Global static FAA categories (Taxi, Takeoff, Landing)
    - `faa_tasks` - Static tasks within FAA categories
    - `user_faa_tasks` - Individual pilot progress tracking for FAA tasks

  2. Profile Updates
    - Add `role` column to profiles (default: 'pilot', optional: 'admin')

  3. Security
    - Enable RLS on all new tables
    - Admin-only policies for managing FAA categories/tasks
    - Pilot policies for tracking their own progress

  4. Sample Data
    - Create default FAA categories and tasks for immediate use
*/

-- Add role column to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'pilot' NOT NULL;
  END IF;
END $$;

-- Create faa_categories table
CREATE TABLE IF NOT EXISTS faa_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  "order" integer NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faa_categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for faa_categories
CREATE POLICY "Anyone can read FAA categories"
  ON faa_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert FAA categories"
  ON faa_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update FAA categories"
  ON faa_categories
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete FAA categories"
  ON faa_categories
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create faa_tasks table
CREATE TABLE IF NOT EXISTS faa_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  faa_category_id uuid NOT NULL REFERENCES faa_categories(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  priority priority_level DEFAULT 'Medium',
  order_in_category integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faa_tasks ENABLE ROW LEVEL SECURITY;

-- RLS policies for faa_tasks
CREATE POLICY "Anyone can read FAA tasks"
  ON faa_tasks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert FAA tasks"
  ON faa_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update FAA tasks"
  ON faa_tasks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete FAA tasks"
  ON faa_tasks
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create user_faa_tasks table
CREATE TABLE IF NOT EXISTS user_faa_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  faa_task_id uuid NOT NULL REFERENCES faa_tasks(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, faa_task_id)
);

ALTER TABLE user_faa_tasks ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_faa_tasks
CREATE POLICY "Users can read own FAA task progress"
  ON user_faa_tasks
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own FAA task progress"
  ON user_faa_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own FAA task progress"
  ON user_faa_tasks
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can manage all user FAA tasks
CREATE POLICY "Admins can manage all user FAA tasks"
  ON user_faa_tasks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert default FAA categories
INSERT INTO faa_categories (name, "order") VALUES
  ('Taxi Approval', 1),
  ('Takeoff Approval', 2),
  ('Landing Approval', 3)
ON CONFLICT ("order") DO NOTHING;

-- Get category IDs for inserting tasks
DO $$
DECLARE
  taxi_id uuid;
  takeoff_id uuid;
  landing_id uuid;
BEGIN
  SELECT id INTO taxi_id FROM faa_categories WHERE name = 'Taxi Approval';
  SELECT id INTO takeoff_id FROM faa_categories WHERE name = 'Takeoff Approval';
  SELECT id INTO landing_id FROM faa_categories WHERE name = 'Landing Approval';

  -- Insert default FAA tasks for Taxi Approval
  INSERT INTO faa_tasks (faa_category_id, title, description, priority, order_in_category) VALUES
    (taxi_id, 'Request taxi clearance from ground control', 'Contact ground control for taxi instructions to runway', 'High', 1),
    (taxi_id, 'Verify taxi route and runway assignment', 'Confirm assigned runway and taxi route with charts', 'High', 2),
    (taxi_id, 'Complete taxi checklist', 'Run through pre-taxi checklist items', 'Medium', 3),
    (taxi_id, 'Monitor ground frequency during taxi', 'Maintain radio contact with ground control', 'Medium', 4)
  ON CONFLICT DO NOTHING;

  -- Insert default FAA tasks for Takeoff Approval
  INSERT INTO faa_tasks (faa_category_id, title, description, priority, order_in_category) VALUES
    (takeoff_id, 'Contact tower for takeoff clearance', 'Request takeoff clearance from control tower', 'High', 1),
    (takeoff_id, 'Complete pre-takeoff checklist', 'Run through all pre-takeoff checklist items', 'High', 2),
    (takeoff_id, 'Verify runway is clear', 'Visual confirmation runway is clear for takeoff', 'High', 3),
    (takeoff_id, 'Set takeoff power and monitor instruments', 'Apply takeoff power and monitor engine parameters', 'High', 4)
  ON CONFLICT DO NOTHING;

  -- Insert default FAA tasks for Landing Approval
  INSERT INTO faa_tasks (faa_category_id, title, description, priority, order_in_category) VALUES
    (landing_id, 'Request landing clearance', 'Contact tower for landing clearance', 'High', 1),
    (landing_id, 'Complete pre-landing checklist', 'Run through pre-landing checklist items', 'High', 2),
    (landing_id, 'Configure aircraft for landing', 'Set flaps, gear, and approach speed', 'High', 3),
    (landing_id, 'Execute landing and taxi clear', 'Land aircraft and taxi clear of runway', 'High', 4)
  ON CONFLICT DO NOTHING;
END $$;