/*
  # Add updated_at field to tasks table

  1. Schema Changes
    - Add `updated_at` column to `tasks` table with automatic timestamp updates
    - Create trigger function to automatically update the timestamp on any row modification
    - Create trigger to execute the function before each update operation

  2. Functionality
    - `updated_at` field captures all user-initiated changes (title, description, status, priority, etc.)
    - Timestamp updates occur server-side for accuracy
    - Existing `created_at` field retained for audit purposes
*/

-- Add updated_at column to tasks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE tasks ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists to avoid conflicts
DROP TRIGGER IF EXISTS tasks_updated_at_trigger ON tasks;

-- Create trigger to automatically update updated_at on any row modification
CREATE TRIGGER tasks_updated_at_trigger
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Update existing tasks to have an initial updated_at value
UPDATE tasks SET updated_at = created_at WHERE updated_at IS NULL;