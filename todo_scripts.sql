use todo;
SELECT * FROM tasks;

-- Add the new column
ALTER TABLE tasks
ADD COLUMN task_index INT;

-- Remove the column from the table
ALTER TABLE tasks
DROP COLUMN column_name;

-- increaseing all 
UPDATE tasks
SET task_index = task_index + 1
WHERE task_id > 0 AND task_index > 2 AND task_index <= 5 AND task_id != 6;





-- remove all data
TRUNCATE TABLE tasks;