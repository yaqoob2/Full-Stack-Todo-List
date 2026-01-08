# Glossy Full Stack Todo App

A beautiful, full-stack Todo application built with React, Node.js, and MySQL.

## Features
- **Glossy UI**: Modern glassmorphism design with animations.
- **Authentication**: Secure Login and Registration.
- **Todo Management**: Add, Edit, Delete tasks.
- **Timer**: Track time spent on tasks with a stopwatch.
- **Scheduling**: Set due dates and reminders.

## Prerequisites
1. **Node.js**: Installed.
2. **MySQL**: Installed and running.

## Setup Instructions

### 1. Database Setup
1. Open your MySQL client (Workbench, Command Line, etc.).
2. Use the `server/schema.sql` file to create the database and tables.
   - Run the SQL queries in `server/schema.sql`.

### 2. Configure Environment
1. Go to the `server` folder.
2. Open `.env` file.
3. Update `DB_PASSWORD` (and other fields if needed) to match your MySQL credentials.

### 3. Application Setup
1. Open a terminal in the root `Todo-List` directory.
2. Install all dependencies (if not already done):
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```
   *(Note: The agent has already installed dependencies, but good to be sure)*

### 4. Run the App
From the root directory, run:
```bash
npm run dev
```
This will start both the Backend (port 5000) and Frontend (port 5173).
Open [http://localhost:5173](http://localhost:5173) to view the app.
