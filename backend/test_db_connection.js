const pool = require('./db/db');

async function testConnection() {
    try {
        console.log('Testing connection...');
        const res = await pool.query('SELECT NOW()');
        console.log('Connection successful:', res.rows[0]);
    } catch (err) {
        console.error('Connection failed:', err);
    }
}

testConnection();
