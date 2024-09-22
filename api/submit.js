const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.my_host,
  user: process.env.my_user,
  password: process.env.my_password,
  database: process.env.my_database,
});

export default async (req, res) => {
  const { name, email, subject, message } = req.body;

  const query = 'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)';
  
  db.query(query, [name, email, subject, message], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Message sent successfully!' });
  });
};
