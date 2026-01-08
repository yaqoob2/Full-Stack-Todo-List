-- 1. Create the Database if it doesn't exist
CREATE DATABASE IF NOT EXISTS todo_app;
USE todo_app;

-- 2. Create the Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create the Todos table
CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATETIME,
  reminder_at DATETIME,
  is_completed BOOLEAN DEFAULT FALSE,
  timer_seconds INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Create a dedicated user for the app with a known password
-- This fixes the "Access Denied" error because we set the password explicitly here.
DROP USER IF EXISTS 'todo_user'@'localhost';
CREATE USER 'todo_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON todo_app.* TO 'todo_user'@'localhost';
FLUSH PRIVILEGES;

-- 5. Test to make sure it exists
SELECT "SUCCESS: Database and User 'todo_user' created successfully!" as message;
