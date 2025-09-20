-- MySQL initialization script for Start From Scratch app
-- This script will be run when the MySQL container starts for the first time

-- Create the application database if it doesn't exist
CREATE DATABASE IF NOT EXISTS start_from_scratch;

-- Grant privileges to the application user
GRANT ALL PRIVILEGES ON start_from_scratch.* TO 'app_user'@'%';
FLUSH PRIVILEGES;

-- Use the application database
USE start_from_scratch;

-- Note: Prisma will handle the table creation through migrations
-- This script just ensures the database and user permissions are set up correctly