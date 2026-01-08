const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('Attempting DB Connection with:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    // Do not log the actual password for security, just if it exists
    hasPassword: !!process.env.DB_PASSWORD
});

// Convert the pool to use promises
const promisePool = pool.promise();

// Test connection
promisePool.getConnection()
    .then(connection => {
        console.log('Connected to MySQL Database');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to MySQL Database:', err.message);
        console.error('Please check your .env file and ensure MySQL is running.');
    });

module.exports = promisePool;
