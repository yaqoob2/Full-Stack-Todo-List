const mysql = require('mysql2/promise');

const passwords_to_try = ['password', '', 'root', 'admin', '1234', '123456'];

async function testConnection() {
    console.log('Testing MySQL connections...');

    for (const pwd of passwords_to_try) {
        console.log(`Trying password: "${pwd}"`);
        try {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: pwd,
                database: 'todo_app' // Try specific DB first
            });
            console.log(`SUCCESS! Connected with password: "${pwd}"`);
            await connection.end();
            return { success: true, password: pwd };
        } catch (err) {
            if (err.code === 'ER_BAD_DB_ERROR') {
                // Password correct, DB missing?
                console.log(`Password "${pwd}" seems correct, but database 'todo_app' is missing.`);
                return { success: true, password: pwd, missingDB: true };
            }
            // console.log(`Failed with "${pwd}": ${err.message}`);
        }
    }

    // Try just connecting to server without DB
    console.log('Retrying connection without specific database (to check if credentials work)...');
    for (const pwd of passwords_to_try) {
        try {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: pwd
            });
            console.log(`SUCCESS! Connected to MySQL Server with password: "${pwd}"`);
            await connection.end();
            return { success: true, password: pwd, missingDB: true };
        } catch (err) {
            // console.log(`Failed with "${pwd}": ${err.message}`);
        }
    }

    return { success: false };
}

testConnection().then(result => {
    if (result.success) {
        console.log('FOUND_PASSWORD:', result.password);
        if (result.missingDB) console.log('DB_MISSING: Yes');
    } else {
        console.log('Could not find correct password.');
    }
});
