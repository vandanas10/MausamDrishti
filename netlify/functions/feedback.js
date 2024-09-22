const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.my_host,
    user: process.env.my_user,
    password: process.env.my_password,
    database: process.env.my_database,
});

exports.handler = async (event) => {
    if (event.httpMethod === 'GET') {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM contacts ORDER BY id DESC', (err, results) => {
                if (err) {
                    return resolve({
                        statusCode: 500,
                        body: JSON.stringify({ error: err.message }),
                    });
                }
                resolve({
                    statusCode: 200,
                    body: JSON.stringify(results),
                });
            });
        });
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
    };
};
