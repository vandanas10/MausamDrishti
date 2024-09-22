const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.my_host,
    user: process.env.my_user,
    password: process.env.my_password,
    database: process.env.my_database
});

db.connect();

module.exports = (req, res) => {
    if (req.method === 'GET') {
        const query = 'SELECT * FROM contacts ORDER BY id DESC';
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(results);
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
