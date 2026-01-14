-- Add current_question_index to rooms table
ALTER TABLE rooms
ADD COLUMN IF NOT EXISTS current_question_index INT DEFAULT 0;

-- Verify
SELECT
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE
    table_name = 'rooms'
    AND column_name = 'current_question_index';