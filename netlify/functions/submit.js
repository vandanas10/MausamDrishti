const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.my_host,
    user: process.env.my_user,
    password: process.env.my_password,
    database: process.env.my_database,
});

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        const { name, email, subject, message } = JSON.parse(event.body);

        const query = 'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)';
        
        return new Promise((resolve, reject) => {
            db.query(query, [name, email, subject, message], (err, result) => {
                if (err) {
                    return resolve({
                        statusCode: 500,
                        body: JSON.stringify({ error: err.message }),
                    });
                }
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Message sent successfully!' }),
                });
            });
        });
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
    };
};
