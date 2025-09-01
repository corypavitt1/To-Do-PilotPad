/*
  # Add Categories and Enhance Tasks

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, category name)
      - `sequential` (boolean, whether tasks must be completed in order)
      - `created_by` (uuid, foreign key to profiles)
      - `created_at` (timestamp)

  2. Modified Tables
    - `tasks`
      - Add `category_id` (uuid, foreign key to categories, nullable)
      - Add `order_in_category` (integer, order within category, nullable)

  3. Security
    - Enable RLS on `categories` table
    - Add policies for authenticated users to manage their own categories
    - Update existing task policies to work with categories
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sequential boolean DEFAULT false,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint for categories
ALTER TABLE categories 
ADD CONSTRAINT categories_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add new columns to tasks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE tasks ADD COLUMN category_id uuid;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'order_in_category'
  ) THEN
    ALTER TABLE tasks ADD COLUMN order_in_category integer;
  END IF;
END $$;

-- Add foreign key constraint for tasks category_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'tasks_category_id_fkey'
  ) THEN
    ALTER TABLE tasks 
    ADD CONSTRAINT tasks_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories
CREATE POLICY "Users can read own categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can create categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete own categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());