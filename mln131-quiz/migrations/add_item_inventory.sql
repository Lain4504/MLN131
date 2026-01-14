-- Migration: Add item_inventory to players table
-- Run this in Supabase SQL Editor

-- 1. Add item_inventory column to players table
ALTER TABLE players
ADD COLUMN IF NOT EXISTS item_inventory JSONB DEFAULT '{"score_boost":0,"time_extend":0,"shield":0,"confusion":0,"time_attack":0}'::jsonb;

-- 2. Update existing players to have default inventory (if any exist)
UPDATE players
SET
    item_inventory = '{"score_boost":0,"time_extend":0,"shield":0,"confusion":0,"time_attack":0}'::jsonb
WHERE
    item_inventory IS NULL;

-- 3. Verify the column was added
SELECT
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE
    table_name = 'players'
    AND column_name = 'item_inventory';